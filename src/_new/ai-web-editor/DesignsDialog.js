import React, { useEffect, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { useEditor } from './EditorContext'
import Icon from './Icon'
import { formatAgo, getDesigns, getSiteName, toHost } from './api'
import { getPagePath } from './versionPath'

// The main web and the 10 latest designs; "Abrir" keeps the page you're on
const DesignsDialog = ({ open, onClose }) => {
    const { ref } = useEditor()
    const [designs, setDesigns] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (open) getDesigns().then(setDesigns, (loadError) => setError(loadError.message))
    }, [open])

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <Dialog.Portal>
                <Dialog.Backdrop className='aiwe-backdrop' />
                <Dialog.Popup className='aiwe-dialog'>
                    <header className='aiwe-header'>
                        <Dialog.Title className='aiwe-title'>Diseños</Dialog.Title>
                        <Dialog.Close className='aiwe-icon-button' aria-label='Cerrar'>
                            <Icon name='close' />
                        </Dialog.Close>
                    </header>
                    <div className='aiwe-body'>
                        {error && <p className='aiwe-error'>{error}</p>}
                        {!designs && !error && <p className='aiwe-empty'>Cargando diseños...</p>}
                        {designs && (
                            <ul className='aiwe-design-list'>
                                {designs.map((design) => (
                                    <li key={design.branch} className={design.branch === ref ? 'aiwe-design current' : 'aiwe-design'}>
                                        <span className='aiwe-design-texts'>
                                            <span className='aiwe-design-name'>{getSiteName(design.branch)}</span>
                                            {design.title && <span className='aiwe-design-title'>{design.title}</span>}
                                            <span className='aiwe-design-meta'>
                                                {toHost(design.url)}
                                                {design.updatedAt && ` · Actualizado ${formatAgo(design.updatedAt)}`}
                                            </span>
                                        </span>
                                        {design.branch === ref
                                            ? <span className='aiwe-chip'>Estás aquí</span>
                                            : (
                                                <a className='aiwe-button secondary small' href={design.url + getPagePath()}>
                                                    Abrir
                                                    <Icon name='external' />
                                                </a>
                                            )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default DesignsDialog
