// Builds the 5 commits before this one into build/versiones/<sha>/ (opened at /versiones/<sha>/)
// and lists them in build/versiones.json for «Ver cambios». Runs after `npm run build` on Vercel.
// A version that fails to build is skipped, so the deploy of the current version never fails because of it.
const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const maxVersionsNumber = 5
const rootDir = path.resolve(__dirname, '../../..')
const buildDir = path.join(rootDir, 'build')
const versionsDir = path.join(buildDir, 'versiones')

const readCommand = (command, cwd = rootDir) => execSync(command, { cwd, encoding: 'utf8' }).trim()

const runCommand = (command, cwd, env = {}) => execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, ...env } })

const sitePaths = 'src public package.json'

// Only commits that change sitePaths; one that only edits cambio.yml looks like the one before it.
// --skip=1 drops the newest, the current site; Vercel clones only the last commits (can be < 5)
const getPreviousCommits = () => {
    const log = readCommand(`git log --skip=1 -n ${maxVersionsNumber} --format=%h%x09%cI%x09%s -- ${sitePaths}`)
    if (!log) return []
    return log.split('\n').map((line) => {
        const [sha, date, subject] = line.split('\t')
        return { sha, date, subject }
    })
}

// First release-note title of that version, in Spanish; the commit subject when it had none.
// Versions before the move to src/_new/ keep it in src/
const getVersionTitle = (worktreeDir, subject) => {
    const releaseNotesFile = [path.join(worktreeDir, 'src', '_new', 'releaseNotesData.js'), path.join(worktreeDir, 'src', 'releaseNotesData.js')]
        .find((file) => fs.existsSync(file))
    if (!releaseNotesFile) return subject
    const titleMatch = fs.readFileSync(releaseNotesFile, 'utf8').match(/title:\s*'((?:[^'\\]|\\.)*)'/)
    if (!titleMatch) return subject
    return titleMatch[1].replace(/\\'/g, "'")
}

// Menu PDFs equal to the current ones are removed: vercel.json sends /versiones/<sha>/pdfs/ to /pdfs/
const removeRepeatedPdfs = (versionDir) => {
    const versionPdfsDir = path.join(versionDir, 'pdfs')
    if (!fs.existsSync(versionPdfsDir)) return
    fs.readdirSync(versionPdfsDir).forEach((file) => {
        const currentPdf = path.join(buildDir, 'pdfs', file)
        if (!fs.existsSync(currentPdf)) return
        if (!fs.readFileSync(currentPdf).equals(fs.readFileSync(path.join(versionPdfsDir, file)))) return
        fs.rmSync(path.join(versionPdfsDir, file))
    })
}

const buildVersion = ({ sha, date, subject }) => {
    const worktreeDir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'version-')), sha)
    const versionDir = path.join(versionsDir, sha)
    try {
        runCommand(`git worktree add --detach "${worktreeDir}" ${sha}`, rootDir)
        fs.symlinkSync(path.join(rootDir, 'node_modules'), path.join(worktreeDir, 'node_modules'))

        /* Make older versions open their pages under /versiones/<sha>/ */
        const appFile = path.join(worktreeDir, 'src', 'App.js')
        fs.writeFileSync(appFile, fs.readFileSync(appFile, 'utf8').replace('<BrowserRouter>', '<BrowserRouter basename={process.env.PUBLIC_URL}>'))

        /* Build and move it into build/versiones/<sha>/ */
        runCommand('npx react-scripts build', worktreeDir, { CI: 'false', PUBLIC_URL: `/versiones/${sha}`, GENERATE_SOURCEMAP: 'false' })
        fs.cpSync(path.join(worktreeDir, 'build'), versionDir, { recursive: true })
        removeRepeatedPdfs(versionDir)

        return { sha, date, title: getVersionTitle(worktreeDir, subject), url: `/versiones/${sha}/` }
    } catch (error) {
        console.error(`Version ${sha} skipped: ${error.message}`)
        fs.rmSync(versionDir, { recursive: true, force: true })
        return null
    } finally {
        // unlinked first so removing the worktree never touches the real node_modules
        fs.rmSync(path.join(worktreeDir, 'node_modules'), { force: true })
        fs.rmSync(worktreeDir, { recursive: true, force: true })
        execSync('git worktree prune', { cwd: rootDir, stdio: 'ignore' })
    }
}

const buildVersions = () => {
    const previousCommits = (() => {
        try {
            return getPreviousCommits()
        } catch (error) {
            console.error(`No previous versions: ${error.message}`)
            return []
        }
    })()

    fs.mkdirSync(versionsDir, { recursive: true })
    const versions = previousCommits.map(buildVersion).filter(Boolean)
    fs.writeFileSync(path.join(buildDir, 'versiones.json'), JSON.stringify(versions, null, 2))
    console.log(`Built ${versions.length} previous versions`)
}

buildVersions()
