// Settings (Vercel env vars), GitHub calls and the access code. The defaults come from Vercel's system env vars,
// so on another Vercel site only EDITOR_CODE, GITHUB_TOKEN and BLOB_READ_WRITE_TOKEN have to be set
const crypto = require('crypto')

const env = process.env

const mainBranch = 'main'
const repo = env.GITHUB_REPO || `${env.VERCEL_GIT_REPO_OWNER}/${env.VERCEL_GIT_REPO_SLUG}`
const workflow = env.EDITOR_WORKFLOW || 'claude-issues.yml'
const productionHost = env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost'
const mainUrl = env.EDITOR_MAIN_URL || `https://${productionHost}`
// '{branch}' -> the branch's slug ('lucas-v1' -> https://asiarestaurants-yongi-lucas-v1.vercel.app)
const designUrl = env.EDITOR_DESIGN_URL || `https://${productionHost.replace(/\.vercel\.app$/, '')}-{branch}.vercel.app`

// Branch and commit of the deployment answering, so each design's editor knows where it is
const deployment = { ref: env.VERCEL_GIT_COMMIT_REF || mainBranch, sha: env.VERCEL_GIT_COMMIT_SHA || null }

const toSlug = (branch) => branch.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// Each site's images go under its own folder, so several sites can share one Blob store
const uploadFolder = `${toSlug(repo.split('/')[1] ?? 'site')}/peticiones`

const getBranchUrl =(branch) => (branch === mainBranch ? mainUrl : designUrl.replace('{branch}', toSlug(branch)))

const github = async (method, route, body) => {
    const token = env.GITHUB_TOKEN
    const res = await fetch(`https://api.github.com/repos/${repo}${route}`, {
        method,
        headers: {
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body && JSON.stringify(body),
    })
    if (!res.ok) throw Object.assign(new Error(`${method} ${route}: ${res.status}`), { status: res.status })
    return res.json()
}

// Issue titles of the Claude runs still going (GitHub names each run after its issue)
const getWorkingTitles = async () => {
    const { workflow_runs } = await github('GET', `/actions/workflows/${workflow}/runs?per_page=10`)
    return workflow_runs.filter((run) => run.status !== 'completed').map((run) => run.display_title)
}

const isBranchName = (ref) => typeof ref === 'string' && /^[\w./-]+$/.test(ref)

// false on 404, so a deleted design can be told apart from GitHub being down
const branchExists = (branch) => github('GET', `/branches/${branch}`).then(() => true, (error) => (error.status === 404 ? false : Promise.reject(error)))

// EDITOR_CODE, typed once in the editor; every write needs it
const isEditorCode = (given) => {
    const expected = env.EDITOR_CODE
    if (!expected || typeof given !== 'string' || given.length !== expected.length) return false
    return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

const hasEditorCode = (req) => isEditorCode(req.headers['x-editor-code'])

module.exports = {
    mainBranch,
    mainUrl,
    deployment,
    uploadFolder,
    getBranchUrl,
    github,
    getWorkingTitles,
    isBranchName,
    branchExists,
    isEditorCode,
    hasEditorCode,
}
