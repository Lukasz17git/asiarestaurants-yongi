import React, { Suspense, lazy, useState } from 'react'
import Icon from './Icon'
import useStatus from './useStatus'
import { getSiteName, setApiUrl } from './api'
import './ai-web-editor.css'

// Loaded on the first open: it brings Base UI, the image uploader and the compressor
const Panel = lazy(() => import('./Panel'))

export const getPhaseText = (phase, status) => {
    if (phase === 'working') return 'La IA está cambiando esta web...'
    if (phase === 'deploy') return 'Publicando los cambios...'
    if (phase === 'elsewhere') return `La IA está trabajando en ${getSiteName(status.working[0].branch)}...`
    return ''
}

// Set before the "¡Cambios listos!" reload, so the new version opens on its changes
const showChangesKey = 'ai-web-editor-show-changes'

const takeShowChanges = () => {
    try {
        const show = sessionStorage.getItem(showChangesKey) === '1'
        sessionStorage.removeItem(showChangesKey)
        return show
    } catch {
        return false
    }
}

const reloadOnChanges = () => {
    try {
        sessionStorage.setItem(showChangesKey, '1')
    } catch {}
    window.location.reload()
}

const ReadyPill = () => (
    <button type='button' className='aiwe-pill' onClick={reloadOnChanges}>
        <Icon name='check' />
        ¡Cambios listos! Pulsa para recargar
    </button>
)

// Short, so it fits the button; the panel shows the whole getPhaseText
const getFabText = (phase) => {
    if (phase === 'deploy') return 'Publicando cambios'
    if (phase === 'working' || phase === 'elsewhere') return 'La IA está trabajando'
    return 'Editar con IA'
}

// Floating "Editar con IA" button (bottom right), which shows the AI status in its text, and the editor panel it opens.
// `apiUrl`: where the site serves server/ (default '/api/ai-editor');
// `changes`: the site's release notes ({ date, title, summary, changes: [{ text }], issue?, branch? }), newest first,
// shown in "Ver cambios"
const AiWebEditor = ({ apiUrl, changes }) => {
    if (apiUrl) setApiUrl(apiUrl)
    const [showChanges] = useState(takeShowChanges)
    const [open, setOpen] = useState(showChanges)
    const [used, setUsed] = useState(showChanges)
    const { status, phase, check } = useStatus(open)
    const busy = phase === 'working' || phase === 'deploy' || phase === 'elsewhere'

    const toggle = () => {
        setUsed(true)
        setOpen(!open)
    }

    return (
        <>
            <div className={open ? 'aiwe-corner open' : 'aiwe-corner'}>
                {phase === 'ready' && !open && <ReadyPill />}
                <button
                    type='button'
                    className='aiwe-fab'
                    onClick={toggle}
                    aria-expanded={open}
                    aria-label={open ? 'Cerrar el editor' : getFabText(phase)}
                    title={busy ? getPhaseText(phase, status) : undefined}
                >
                    {busy ? <span className='aiwe-spinner' /> : <Icon name='sparkle' />}
                    <span className='aiwe-fab-label'>{getFabText(phase)}</span>
                    {open && <Icon name='close' />}
                </button>
            </div>
            {used && (
                <Suspense fallback={null}>
                    <Panel
                        open={open}
                        onOpenChange={setOpen}
                        status={status}
                        phase={phase}
                        onSent={() => check({ watch: true })}
                        changes={changes}
                        initialView={showChanges ? 'changes' : 'home'}
                    />
                </Suspense>
            )}
        </>
    )
}

export default AiWebEditor
