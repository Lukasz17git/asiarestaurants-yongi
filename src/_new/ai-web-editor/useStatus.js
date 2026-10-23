import { useCallback, useEffect, useRef, useState } from 'react'
import { getStatus } from './api'
import { historyNumber } from './versionPath'

const pollMs = 15000
// After sending a request, the workflow run takes up to ~1 min to show up in GitHub
const watchMs = 3 * 60000

const busyPhases = ['working', 'deploy', 'elsewhere']

// 'ready': a newer version is live than this tab's, 'working': Claude is changing this site,
// 'deploy': pushed, Vercel still building, 'elsewhere': Claude is working on another design.
// A version page stays on its commit, so it's never 'ready' or 'deploy'
const getPhase = (status, loadedSha) => {
    if (!status) return null
    const versionPage = historyNumber !== null
    if (!versionPage && loadedSha && status.sha && status.sha !== loadedSha) return 'ready'
    if (status.working.some(({ branch }) => branch === status.ref)) return 'working'
    if (!versionPage && status.sha && status.branchSha && status.sha !== status.branchSha) return 'deploy'
    if (status.working.length) return 'elsewhere'
    return null
}

// Checks once on load and when the tab is back; polls every 15s only while `open` (the panel), while the AI works or
// Vercel deploys, and for 3 min after `check({ watch: true })` (a request just sent). Visitors stay at one call per load.
// 'ready' stops it until the reload. `status` is null until the first answer, or for good without the function (npm start)
const useStatus = (open) => {
    const [status, setStatus] = useState(null)
    const [phase, setPhase] = useState(null)
    const openRef = useRef(open)
    const checkRef = useRef(() => {})

    useEffect(() => {
        let active = true
        let checking = false
        let loadedSha = null
        let watchUntil = 0
        let timer
        const check = async ({ watch } = {}) => {
            if (watch) watchUntil = Date.now() + watchMs
            if (checking) return
            checking = true
            clearTimeout(timer)
            const next = await getStatus().catch(() => null)
            checking = false
            if (!active) return
            loadedSha ??= next?.sha
            const nextPhase = getPhase(next, loadedSha)
            if (next) setStatus(next)
            setPhase(nextPhase)
            const keepPolling = openRef.current || busyPhases.includes(nextPhase) || Date.now() < watchUntil
            if (nextPhase !== 'ready' && keepPolling && !document.hidden) timer = setTimeout(check, pollMs)
        }
        const checkWhenVisible = () => !document.hidden && check()
        checkRef.current = check
        check()
        document.addEventListener('visibilitychange', checkWhenVisible)
        return () => {
            active = false
            clearTimeout(timer)
            document.removeEventListener('visibilitychange', checkWhenVisible)
        }
    }, [])

    // Opening the panel checks at once and keeps polling while it stays open
    useEffect(() => {
        openRef.current = open
        if (open) checkRef.current()
    }, [open])

    const check = useCallback((options) => checkRef.current(options), [])
    return { status, phase, check }
}

export default useStatus
