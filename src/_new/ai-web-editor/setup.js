// Sets up the editor on a GitHub repo deployed by Vercel, with the tokens saved once in ~/.ai-web-editor.env:
// copies the editor's files into it (when given another repo's folder), sets its GitHub secrets and variables
// and its Vercel env vars, and redeploys. Safe to run again: it keeps the site's EDITOR_CODE.
//   node src/_new/ai-web-editor/setup.js [../other-repo] [--client=<client's GitHub login>]
// Needs Node 22 and the GitHub CLI logged in (`gh auth login`)
const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { execFileSync, execSync } = require('child_process')

const settingsFile = path.join(os.homedir(), '.ai-web-editor.env')
const sourceRoot = path.resolve(__dirname, '../../..')

const settingKeys = ['GITHUB_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN', 'VERCEL_TOKEN', 'VERCEL_TEAM', 'BLOB_READ_WRITE_TOKEN', 'CLAUDE_ALLOWED_USERS']

const settingsTemplate = `# Shared by every site with the AI web editor (src/_new/ai-web-editor/setup.js)

# Fine-grained token, "All repositories", with Issues read/write, Actions read and Contents read:
# https://github.com/settings/personal-access-tokens/new
GITHUB_TOKEN=

# Claude subscription token for the GitHub workflow: run \`claude setup-token\`
CLAUDE_CODE_OAUTH_TOKEN=

# https://vercel.com/account/tokens
VERCEL_TOKEN=

# The team in your Vercel addresses: vercel.com/<team>
VERCEL_TEAM=

# The Blob store every site shares: its page in Vercel -> ".env.local" tab
BLOB_READ_WRITE_TOKEN=

# GitHub logins that can send requests on every site, comma-separated; add each site's client with --client=<login>
CLAUDE_ALLOWED_USERS=
`

// src/_new/ai-web-editor/ is always replaced, so a site gets the editor's updates; the rest is only copied when missing
const editorFolder = 'src/_new/ai-web-editor'
const siteFiles = [
    'api/ai-editor.js',
    'middleware.js',
    '.github/workflows/claude-issues.yml',
    '.github/workflows/design-domains.yml',
    '.github/ISSUE_TEMPLATE',
    'src/_new/scripts/design-domains.js',
    '.claude/agents/client-reply.md',
    // Loaded by the workflow's prompt
    '.claude/skills/code',
    '.claude/skills/commit-message',
    '.claude/skills/multiple-skills',
    '.claude/skills/simple-text',
]
const editorDependencies = ['@base-ui/react', '@vercel/blob', 'browser-image-compression']

const releaseNotesFile = 'src/_new/releaseNotesData.js'
const releaseNotesStart = `// «Editar con IA» -> «Ver cambios», newest first, in Spanish for the client (date: 'YYYY-MM-DD')
// Lists only the entries whose \`branch\` is the one the site was built from
const releaseNotes = []

export default releaseNotes
`

/*
 * Settings
 */

// KEY=value lines; a missing file is created with every key and where to get it
const readSettings = () => {
    if (!fs.existsSync(settingsFile)) {
        fs.writeFileSync(settingsFile, settingsTemplate)
        throw new Error(`Fill in ${settingsFile} and run this again`)
    }
    const settings = Object.fromEntries(fs.readFileSync(settingsFile, 'utf8')
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/))
        .filter(Boolean)
        .map(([, key, value]) => [key, value]))
    const missingKeys = settingKeys.filter((key) => !settings[key])
    if (missingKeys.length) throw new Error(`Missing in ${settingsFile}: ${missingKeys.join(', ')}`)
    return settings
}

const readArgs = () => {
    const args = process.argv.slice(2)
    const client = args.find((arg) => arg.startsWith('--client='))?.split('=')[1]
    const target = args.find((arg) => !arg.startsWith('--'))
    return { targetRoot: path.resolve(target ?? process.cwd()), client }
}

/*
 * Files
 */

// fs.cpSync exits silently (code 127) on Node 22 when the path has accents ('Programación')
const copy = (from, to) => {
    if (!fs.statSync(from).isDirectory()) {
        fs.mkdirSync(path.dirname(to), { recursive: true })
        return fs.copyFileSync(from, to)
    }
    for (const name of fs.readdirSync(from)) copy(path.join(from, name), path.join(to, name))
}

const copyFiles = (targetRoot) => {
    copy(path.join(sourceRoot, editorFolder), path.join(targetRoot, editorFolder))
    console.log(`Copied ${editorFolder}/`)
    for (const file of siteFiles) {
        const targetFile = path.join(targetRoot, file)
        if (fs.existsSync(targetFile)) {
            console.log(`Kept ${file}`)
            continue
        }
        copy(path.join(sourceRoot, file), targetFile)
        console.log(`Copied ${file}`)
    }
    if (!fs.existsSync(path.join(targetRoot, releaseNotesFile))) {
        fs.writeFileSync(path.join(targetRoot, releaseNotesFile), releaseNotesStart)
        console.log(`Created ${releaseNotesFile}`)
    }
}

// Vercel calls '?action=cleanup' daily at 4:00 UTC, which deletes the reference images older than 7 days
const cleanupCron = { path: '/api/ai-editor?action=cleanup', schedule: '0 4 * * *' }

// Adds cleanupCron to the site's vercel.json, keeping the rest
const addCleanupCron = (targetRoot) => {
    const file = path.join(targetRoot, 'vercel.json')
    const config = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
    if (config.crons?.some(({ path: cronPath }) => cronPath === cleanupCron.path)) return console.log('Kept the cleanup cron in vercel.json')
    config.crons = [...(config.crons ?? []), cleanupCron]
    fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`)
    console.log('Added the cleanup cron to vercel.json')
}

// Same versions as this repo, exact, so every site runs the editor it was tested with
const installDependencies = (targetRoot) => {
    const readDependencies = (root) => JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).dependencies ?? {}
    const sourceDependencies = readDependencies(sourceRoot)
    const targetDependencies = readDependencies(targetRoot)
    const missing = editorDependencies.filter((name) => targetDependencies[name] !== sourceDependencies[name])
    if (!missing.length) return
    const packages = missing.map((name) => `${name}@${sourceDependencies[name]}`).join(' ')
    console.log(`npm install ${packages}`)
    execSync(`npm install --save-exact --no-audit --no-fund ${packages}`, { cwd: targetRoot, stdio: 'inherit' })
}

const isEditorMounted = (targetRoot) => {
    const findMount = (folder) => fs.readdirSync(folder, { withFileTypes: true }).some((entry) => {
        const entryPath = path.join(folder, entry.name)
        if (entry.isDirectory()) return entry.name !== 'ai-web-editor' && findMount(entryPath)
        return /\.(jsx?|tsx?)$/.test(entry.name) && fs.readFileSync(entryPath, 'utf8').includes('<AiWebEditor')
    })
    return findMount(path.join(targetRoot, 'src'))
}

/*
 * GitHub
 */

const gh = (args, cwd, input) => execFileSync('gh', args, { cwd, input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()

const getRepo = (targetRoot) => {
    try {
        return gh(['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], targetRoot)
    } catch {
        throw new Error(`${targetRoot} isn't a GitHub repo yet: push it to GitHub (\`gh repo create\`) and run this again`)
    }
}

const getRepoVariable = (repo, name) => {
    try {
        return gh(['variable', 'get', name, '--repo', repo])
    } catch {
        return ''
    }
}

// Keeps the logins already allowed (e.g. a client added by hand) and adds the shared ones and --client
const getAllowedUsers = (repo, settings, client) => {
    const logins = [getRepoVariable(repo, 'CLAUDE_ALLOWED_USERS'), settings.CLAUDE_ALLOWED_USERS, client ?? '']
        .flatMap((list) => list.split(','))
        .map((login) => login.trim())
        .filter(Boolean)
    return [...new Set(logins)].join(',')
}

// Secrets go through stdin, so they don't show in the process list
const setGitHubSettings = (repo, settings, project, client) => {
    gh(['secret', 'set', 'CLAUDE_CODE_OAUTH_TOKEN', '--repo', repo], undefined, settings.CLAUDE_CODE_OAUTH_TOKEN)
    gh(['secret', 'set', 'VERCEL_TOKEN', '--repo', repo], undefined, settings.VERCEL_TOKEN)
    const allowedUsers = getAllowedUsers(repo, settings, client)
    const variables = { CLAUDE_ALLOWED_USERS: allowedUsers, VERCEL_PROJECT: project.name, VERCEL_TEAM: settings.VERCEL_TEAM }
    for (const [name, value] of Object.entries(variables)) gh(['variable', 'set', name, '--repo', repo, '--body', value])
    console.log(`GitHub: secrets CLAUDE_CODE_OAUTH_TOKEN, VERCEL_TOKEN; CLAUDE_ALLOWED_USERS=${allowedUsers}`)
}

/*
 * Vercel
 */

const createVercel = ({ VERCEL_TOKEN, VERCEL_TEAM }) => async (method, route, body) => {
    const separator = route.includes('?') ? '&' : '?'
    const res = await fetch(`https://api.vercel.com${route}${separator}slug=${VERCEL_TEAM}`, {
        method,
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
        body: body && JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw Object.assign(new Error(`Vercel ${method} ${route}: ${res.status} ${data.error?.message ?? ''}`), { status: res.status })
    return data
}

// The project deployed from the repo, checked by its git link so env vars never land on another site's project
const findProject = async (vercel, repo) => {
    const isFromRepo = (project) => `${project?.link?.org}/${project?.link?.repo}`.toLowerCase() === repo.toLowerCase()
    const { projects = [] } = await vercel('GET', `/v10/projects?repoUrl=${encodeURIComponent(`https://github.com/${repo}`)}`)
    const namedProject = await vercel('GET', `/v9/projects/${repo.split('/')[1]}`).catch(() => null)
    const project = projects.find(isFromRepo) ?? (isFromRepo(namedProject) ? namedProject : null)
    if (!project) throw new Error(`No Vercel project deploys ${repo}: import it at https://vercel.com/new and run this again`)
    return project
}

// 'ab12-cd34-ef56': easy to type and read out to the client
const createEditorCode = () => crypto.randomBytes(6).toString('hex').match(/.{4}/g).join('-')

// Hides the Vercel Toolbar on the designs (preview deploys), so the client never sees it
const hideToolbar = { key: 'VERCEL_PREVIEW_FEEDBACK_ENABLED', value: '0', type: 'plain', target: ['preview'] }

// Production and preview, so the designs (other branches) get them too
const setVercelEnv = async (vercel, project, settings) => {
    const { envs } = await vercel('GET', `/v10/projects/${project.id}/env`)
    const hasEnv = (name) => envs.some(({ key }) => key === name)
    const editorCode = hasEnv('EDITOR_CODE') ? null : createEditorCode()
    const values = {
        GITHUB_TOKEN: settings.GITHUB_TOKEN,
        BLOB_READ_WRITE_TOKEN: settings.BLOB_READ_WRITE_TOKEN,
        // The versions list reads the site's Vercel deploys
        EDITOR_VERCEL_TOKEN: settings.VERCEL_TOKEN,
        EDITOR_VERCEL_TEAM: settings.VERCEL_TEAM,
        EDITOR_VERCEL_PROJECT: project.id,
        ...(editorCode && { EDITOR_CODE: editorCode }),
        // Vercel sends it to the cleanup cron, so nobody else can call it
        ...(!hasEnv('CRON_SECRET') && { CRON_SECRET: crypto.randomBytes(24).toString('hex') }),
    }
    await vercel('POST', `/v10/projects/${project.id}/env?upsert=true`, [
        ...Object.entries(values).map(([key, value]) => ({ key, value, type: 'encrypted', target: ['production', 'preview'] })),
        hideToolbar,
    ])
    console.log(`Vercel: ${[...Object.keys(values), hideToolbar.key].join(', ')} on ${project.name}`)
    return editorCode
}

const redeploy = async (vercel, project, repo) => {
    const [org, repoName] = repo.split('/')
    const ref = project.link?.productionBranch ?? 'main'
    const deployment = await vercel('POST', '/v13/deployments', {
        name: project.name,
        project: project.id,
        target: 'production',
        gitSource: { type: 'github', org, repo: repoName, ref },
    })
    console.log(`Redeploying ${ref}: https://${deployment.url}`)
}

/*
 * Setup
 */

const setup = async () => {
    const settings = readSettings()
    const { targetRoot, client } = readArgs()
    // relative() ignores casing on Windows ('c:\…' and 'C:\…')
    const isOtherRepo = path.relative(sourceRoot, targetRoot) !== ''
    if (isOtherRepo) {
        copyFiles(targetRoot)
        addCleanupCron(targetRoot)
        installDependencies(targetRoot)
    }

    const repo = getRepo(targetRoot)
    const vercel = createVercel(settings)
    const project = await findProject(vercel, repo)
    setGitHubSettings(repo, settings, project, client)
    const editorCode = await setVercelEnv(vercel, project, settings)
    // Copied files reach Vercel with the next push, which already gets the env vars
    if (!isOtherRepo) await redeploy(vercel, project, repo)

    console.log('')
    console.log(editorCode ? `Access code for the client: ${editorCode}` : 'Kept the site\'s EDITOR_CODE')
    if (!isEditorMounted(targetRoot)) {
        console.log(`Mount it once in the app: import AiWebEditor from './_new/ai-web-editor' and releaseNotes from './_new/releaseNotesData',`)
        console.log(`then <AiWebEditor changes={releaseNotes} />`)
    }
    if (isOtherRepo) console.log('Commit and push the copied files: Vercel deploys them with the editor working')
}

setup().catch((error) => {
    console.error(error.message)
    process.exit(1)
})
