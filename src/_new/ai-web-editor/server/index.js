// The editor's only Vercel function: the site's api/ai-editor.js re-exports it, and `?action=` picks the handler.
// Vercel's CDN keeps the GET answers a few seconds (s-maxage), so every visitor polling shares one call to GitHub
const { handleUpload } = require('@vercel/blob/client')
const {
    mainBranch,
    mainUrl,
    deployment,
    uploadFolder,
    getBranchUrl,
    github,
    vercelSettings,
    vercel,
    getWorkingTitles,
    isBranchName,
    branchExists,
    isEditorCode,
    hasEditorCode,
} = require('./github')
const {
    requestTypes,
    getPayloadError,
    cleanImages,
    cleanName,
    cleanPage,
    buildIssueBody,
    buildCommentBody,
    getTitle,
    getBranch,
    getRequestContent,
    toMessageContent,
    toSummary,
} = require('./requests')

const maxDesigns = 10
const maxVersions = 10
const maxImageBytes = 5 * 1024 * 1024

const getRecentIssues = async (count = 30) => {
    const issues = await github('GET', `/issues?state=all&sort=created&direction=desc&per_page=${count}`)
    return issues.filter((issue) => !issue.pull_request)
}

const sendCached = (res, seconds, data) => {
    res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=${seconds}`)
    res.json(data)
}

const rejectCode = (res) => res.status(401).json({ error: 'Código de acceso incorrecto.' })

/*
 * Status
 */

// Where this deployment is, the commit its branch is on in GitHub (newer while Vercel builds a push)
// and the requests Claude is working on; the issues are only read while a run is going
const getStatus = async (req, res) => {
    const [workingTitles, branch] = await Promise.all([
        getWorkingTitles(),
        github('GET', `/branches/${deployment.ref}`).catch(() => null),
    ])
    const working = workingTitles.length
        ? (await getRecentIssues())
            .filter((issue) => workingTitles.includes(issue.title))
            .map((issue) => ({ number: issue.number, title: issue.title, branch: getBranch(issue) }))
        : []
    sendCached(res, 10, {
        ref: deployment.ref,
        url: getBranchUrl(deployment.ref),
        mainUrl,
        sha: deployment.sha,
        deploymentHost: deployment.host,
        branchSha: branch?.commit.sha ?? null,
        working,
        uploadFolder,
    })
}

/*
 * Requests
 */

// The last 100, so each design (the editor shows only its own) still has its older ones
const listRequests = async (req, res) => {
    const [issues, workingTitles] = await Promise.all([getRecentIssues(100), getWorkingTitles()])
    sendCached(res, 5, issues.map((issue) => toSummary(issue, workingTitles)))
}

// '' when the request can be sent, else why not; the workflow stops on a deleted "Diseño" branch
const getRequestError = async ({ type, name, text, ref, images }) => {
    if (!Object.hasOwn(requestTypes, type)) return 'No se reconoce la petición.'
    if (type === 'new' && !name) return 'Ponle un nombre a tu diseño.'
    const payloadError = getPayloadError({ text, images }, { optional: type === 'promote' || type === 'restore' })
    if (payloadError) return payloadError
    if (!isBranchName(ref)) return 'No se reconoce el diseño desde el que lo pides.'
    if (type === 'promote' && ref === mainBranch) return 'Esta ya es la web principal.'
    if (type !== 'new' && ref !== mainBranch && !(await branchExists(ref))) return 'Este diseño ya no existe. Abre el editor desde otro diseño.'
    return ''
}

// { sha, date } of `sha` when it's an earlier commit of `ref`, else null ('identical' is the current version)
const findEarlierVersion = async (sha, ref) => {
    if (typeof sha !== 'string' || !/^[0-9a-f]{7,40}$/.test(sha)) return null
    const comparison = await github('GET', `/compare/${sha}...${ref}?per_page=1`).catch((error) => (error.status === 404 ? null : Promise.reject(error)))
    if (comparison?.status !== 'ahead') return null
    return { sha: comparison.base_commit.sha, date: comparison.base_commit.commit.committer.date }
}

const createRequest = async (req, res) => {
    if (!hasEditorCode(req)) return rejectCode(res)

    const { type, name: givenName, text = '', ref, version: versionSha, page, images = [] } = req.body ?? {}
    const name = type === 'new' ? cleanName(givenName) : ''
    const requestError = await getRequestError({ type, name, text, ref, images })
    if (requestError) return res.status(400).json({ error: requestError })
    const version = type === 'restore' ? await findEarlierVersion(versionSha, ref) : null
    if (type === 'restore' && !version) return res.status(400).json({ error: 'No se puede volver a esta versión: no es una versión anterior de esta web.' })

    const body = buildIssueBody({ type, name, text, ref, version, page: cleanPage(page), images: cleanImages(images) })
    const issue = await github('POST', '/issues', { title: getTitle({ type, name, text, ref, version }), body })
    res.status(201).json({ number: issue.number })
}

const getNumber = (req) => (/^\d+$/.test(req.query.number ?? '') ? req.query.number : null)

// Claude replies as github-actions[bot]; everything else is the client (or the owner on GitHub)
const getThread = async (req, res) => {
    const number = getNumber(req)
    if (!number) return res.status(400).json({ error: 'Invalid request number' })

    const [issue, comments, workingTitles] = await Promise.all([
        github('GET', `/issues/${number}`),
        github('GET', `/issues/${number}/comments?per_page=100`),
        getWorkingTitles(),
    ])
    if (issue.pull_request) return res.status(404).json({ error: 'Not a change request' })

    const messages = [
        { id: `issue-${issue.number}`, from: 'client', createdAt: issue.created_at, ...getRequestContent(issue.body) },
        ...comments.map((comment) => ({
            id: comment.id,
            from: comment.user.type === 'Bot' ? 'ai' : 'client',
            createdAt: comment.created_at,
            ...toMessageContent(comment.body ?? ''),
        })),
    ]
    sendCached(res, 4, { ...toSummary(issue, workingTitles), messages })
}

const addReply = async (req, res) => {
    const number = getNumber(req)
    if (!number) return res.status(400).json({ error: 'Invalid request number' })
    if (!hasEditorCode(req)) return rejectCode(res)

    const { text, page, images = [] } = req.body ?? {}
    const payloadError = getPayloadError({ text, images })
    if (payloadError) return res.status(400).json({ error: payloadError })

    const body = buildCommentBody({ text, page: cleanPage(page), images: cleanImages(images) })
    await github('POST', `/issues/${number}/comments`, { body })
    res.status(201).json({ ok: true })
}

/*
 * Designs
 */

// The main web and the 10 designs (every other branch) with the latest commits; a design made by the editor
// ('diseno-12') gets the title of its issue (#12): the name the client gave it
const listDesigns = async (req, res) => {
    const [branches, issues] = await Promise.all([github('GET', '/branches?per_page=100'), getRecentIssues()])
    const dated = await Promise.all(branches
        .filter(({ name }) => name !== mainBranch)
        .slice(0, 30)
        .map(async ({ name, commit }) => {
            const { commit: { committer } } = await github('GET', `/commits/${commit.sha}`)
            return { branch: name, updatedAt: committer.date }
        }))
    const designs = dated
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, maxDesigns)
        .map((design) => {
            const issueNumber = Number(design.branch.match(/^diseno-(\d+)$/)?.[1])
            const issue = issues.find(({ number }) => number === issueNumber)
            return { ...design, title: issue?.title ?? null, url: getBranchUrl(design.branch) }
        })
    sendCached(res, 60, [{ branch: mainBranch, updatedAt: null, title: null, url: mainUrl }, ...designs])
}

/*
 * Versions
 */

// 'Changed the menu prices (#12)' -> 12
const getIssueNumber = (message) => Number(message.split('\n')[0].match(/\(#(\d+)\)\s*$/)?.[1]) || null

// The last 10 deploys of this branch Vercel finished, newest (the current version) first, one per commit. Each stays
// at its own address, so opening one builds nothing. Titled by its request's title, else by its commit's first line
const listVersions = async (req, res) => {
    if (!vercelSettings) return sendCached(res, 60, [])

    const query = new URLSearchParams({ projectId: vercelSettings.project, branch: deployment.ref, state: 'READY', limit: '30' })
    const [{ deployments }, issues] = await Promise.all([vercel(`/v6/deployments?${query}`), getRecentIssues(100)])
    // A redeploy of the same commit is the same version
    const unique = deployments.filter((deploy, index) => deployments.findIndex(({ meta }) => meta?.githubCommitSha === deploy.meta?.githubCommitSha) === index)
    const versions = unique
        .filter(({ meta }) => meta?.githubCommitSha)
        .slice(0, maxVersions)
        .map(({ url, created, meta }) => {
            const message = meta.githubCommitMessage ?? ''
            const request = getIssueNumber(message)
            const issue = issues.find(({ number }) => number === request)
            return {
                sha: meta.githubCommitSha,
                date: new Date(created).toISOString(),
                title: issue?.title ?? message.split('\n')[0],
                request,
                url: `https://${url}`,
            }
        })
    sendCached(res, 30, versions)
}

/*
 * Access code and uploads
 */

const checkAccess = (req, res) => {
    if (!process.env.EDITOR_CODE) return res.status(503).json({ error: 'El editor todavía no está activado.' })
    if (!hasEditorCode(req)) return rejectCode(res)
    res.json({ ok: true })
}

// Gives the editor a token to upload one image straight to Vercel Blob, so it never goes through
// this function (4.5MB body limit). Needs BLOB_READ_WRITE_TOKEN, added when a Blob store is connected
const upload = async (req, res) => {
    try {
        const result = await handleUpload({
            body: req.body,
            request: req,
            // upload() can't send headers, so the editor code comes as clientPayload
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                if (!isEditorCode(clientPayload)) throw new Error('Código de acceso incorrecto.')
                if (!pathname.startsWith(`${uploadFolder}/`)) throw new Error(`Invalid pathname: ${pathname}`)
                return { allowedContentTypes: ['image/webp', 'image/jpeg', 'image/png'], maximumSizeInBytes: maxImageBytes, addRandomSuffix: true }
            },
        })
        res.json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const handlers = {
    'GET status': getStatus,
    'GET requests': listRequests,
    'POST requests': createRequest,
    'GET request': getThread,
    'POST request': addReply,
    'GET designs': listDesigns,
    'GET versions': listVersions,
    'POST access': checkAccess,
    'POST upload': upload,
}

module.exports = async (req, res) => {
    const key = `${req.method} ${req.query.action}`
    if (!Object.hasOwn(handlers, key)) return res.status(404).json({ error: `Unknown action: ${key}` })

    try {
        await handlers[key](req, res)
    } catch (error) {
        res.status(error.status === 404 ? 404 : 502).json({ error: error.message })
    }
}
