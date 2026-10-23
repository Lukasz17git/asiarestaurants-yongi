import React, { useEffect, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { EditorContext } from './EditorContext'
import Icon from './Icon'
import Home from './Home'
import History from './History'
import RequestForm from './RequestForm'
import Thread from './Thread'
import Changes from './Changes'
import DesignsDialog from './DesignsDialog'
import PromoteDialog from './PromoteDialog'
import RestoreDialog from './RestoreDialog'
import { forgetCode, getSavedCode, getVersions, isVersionPage, mainBranch } from './api'

const getTitle = (view, ref) => {
    if (view.name === 'history') return 'Tus peticiones'
    if (view.name === 'changes') return 'Cambios'
    if (view.name === 'thread') return `Petición #${view.number}`
    if (view.name === 'form' && view.type === 'new') return 'Crear un diseño nuevo'
    if (view.name === 'form') return ref === mainBranch ? 'Editar esta web' : 'Editar este diseño'
    return 'Editar con IA'
}

// The version this page shows when it's opened by its own address and isn't the newest; null on the site's address.
// Older than the 10 listed: only its sha is known
const getOldVersion = (status, versions) => {
    if (!isVersionPage(status) || !versions?.length || versions[0].sha === status.sha) return null
    return versions.find(({ sha }) => sha === status.sha) ?? { sha: status.sha, date: null, title: null, url: null }
}

// Chat-like panel over the bottom right corner. Non-modal, so the site can still be scrolled and clicked
// while it's open; kept mounted, so a half-written request survives closing it.
// `view` is { name: 'home' } | { name: 'form', type: 'edit' | 'new' } | { name: 'thread', number } | { name: 'history' }
// | { name: 'changes' }
const Panel = ({ open, onOpenChange, status, phase, onSent, changes, initialView = 'home' }) => {
    const [view, setView] = useState({ name: initialView })
    const [dialog, setDialog] = useState(null)
    const [code, setCode] = useState(getSavedCode)
    // [] without the function or its Vercel settings
    const [versions, setVersions] = useState(null)
    const ref = status?.ref ?? mainBranch
    const oldVersion = getOldVersion(status, versions)

    useEffect(() => {
        if (open) getVersions().then(setVersions, () => setVersions([]))
    }, [open])

    const rejectCode = () => {
        forgetCode()
        setCode('')
    }
    const openThread = (number) => setView({ name: 'thread', number })
    const onRequestSent = (number) => {
        setDialog(null)
        openThread(number)
        onSent()
    }

    const renderView = () => {
        if (view.name === 'history') return <History onOpen={openThread} />
        if (view.name === 'changes') return <Changes changes={changes} onOpenRequest={openThread} />
        if (view.name === 'thread') return <Thread key={view.number} number={view.number} active={open} />
        if (view.name === 'form') return <RequestForm key={view.type} type={view.type} onSent={onRequestSent} />
        return (
            <Home
                open={open}
                phase={phase}
                onEdit={(type) => setView({ name: 'form', type })}
                onPromote={() => setDialog('promote')}
                onRestore={() => setDialog('restore')}
                onDesigns={() => setDialog('designs')}
                onOpenRequest={openThread}
                onHistory={() => setView({ name: 'history' })}
                onChanges={changes ? () => setView({ name: 'changes' }) : null}
            />
        )
    }

    return (
        <EditorContext.Provider value={{ code, setCode, rejectCode, ref, status, versions, oldVersion }}>
            <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal>
                <Dialog.Portal keepMounted>
                    <Dialog.Popup className='aiwe-panel'>
                        <header className='aiwe-header'>
                            {view.name !== 'home' && (
                                <button type='button' className='aiwe-icon-button' onClick={() => setView({ name: 'home' })} aria-label='Volver'>
                                    <Icon name='back' />
                                </button>
                            )}
                            <Dialog.Title className='aiwe-title'>{getTitle(view, ref)}</Dialog.Title>
                            <Dialog.Close className='aiwe-icon-button' aria-label='Cerrar'>
                                <Icon name='close' />
                            </Dialog.Close>
                        </header>
                        <div className='aiwe-body'>{renderView()}</div>
                        <DesignsDialog open={dialog === 'designs'} onClose={() => setDialog(null)} />
                        <PromoteDialog open={dialog === 'promote'} onClose={() => setDialog(null)} onSent={onRequestSent} />
                        <RestoreDialog open={dialog === 'restore'} onClose={() => setDialog(null)} onSent={onRequestSent} />
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
        </EditorContext.Provider>
    )
}

export default Panel
