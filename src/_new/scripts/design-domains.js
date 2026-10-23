// Gives every design branch (all but main) a short Vercel address ('lucas-v1' -> asiarestaurants-yongi-lucas-v1.vercel.app,
// not ...-git-lucas-v1-lukasz17gits-projects.vercel.app) and removes the ones of deleted branches.
// Runs from .github/workflows/design-domains.yml with the VERCEL_TOKEN secret and the VERCEL_PROJECT and VERCEL_TEAM variables.
const { execSync } = require('child_process')

const { VERCEL_PROJECT: project, VERCEL_TEAM: team, VERCEL_TOKEN: token } = process.env

// Same slug as toSlug in src/_new/ai-web-editor/server/github.js, or "Ver diseños" would link to a missing address
const toSlug = (branch) => branch.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const getDesignDomain = (branch) => `${project}-${toSlug(branch)}.vercel.app`
const getVercelBranchUrl = (branch) => `${project}-git-${toSlug(branch)}-${team}.vercel.app`

const vercel = async (method, route, body) => {
    const separator = route.includes('?') ? '&' : '?'
    const res = await fetch(`https://api.vercel.com${route}${separator}slug=${team}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body && JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(`${method} ${route}: ${res.status} ${data.error?.message ?? ''}`)
    return data
}

const getDesignBranches = () => execSync('git ls-remote --heads origin', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .map((line) => line.split('refs/heads/')[1])
    .filter((branch) => branch && branch !== 'main')

// A new domain only opens the branch's next deploys, so the live one gets it too
const pointToLiveDeploy = async (branch, domain) => {
    try {
        const { id } = await vercel('GET', `/v13/deployments/${getVercelBranchUrl(branch)}`)
        await vercel('POST', `/v2/deployments/${id}/aliases`, { alias: domain })
    } catch (error) {
        console.log(`${domain} will open ${branch}'s next deploy (${error.message})`)
    }
}

const addDomain = async (branch) => {
    const domain = getDesignDomain(branch)
    try {
        await vercel('POST', `/v10/projects/${project}/domains`, { name: domain, gitBranch: branch })
        await pointToLiveDeploy(branch, domain)
        console.log(`Added ${domain}`)
    } catch (error) {
        console.error(`${domain} not added: ${error.message}`)
    }
}

const syncDomains = async () => {
    if (!token || !project || !team) return console.log('No VERCEL_TOKEN secret or VERCEL_TEAM variable: design branches keep their long Vercel address')

    const branches = getDesignBranches()
    const { domains } = await vercel('GET', `/v9/projects/${project}/domains?limit=100`)
    const missingBranches = branches.filter((branch) => !domains.some(({ name }) => name === getDesignDomain(branch)))
    // Only *.vercel.app domains tied to a branch, so a real domain (asiarestaurants.es) is never removed
    const staleDomains = domains.filter(({ name, gitBranch }) => gitBranch && name.endsWith('.vercel.app') && !branches.includes(gitBranch))

    for (const branch of missingBranches) await addDomain(branch)
    for (const { name } of staleDomains) {
        await vercel('DELETE', `/v9/projects/${project}/domains/${name}`)
        console.log(`Removed ${name}`)
    }
}

syncDomains().catch((error) => {
    console.error(error.message)
    process.exit(1)
})
