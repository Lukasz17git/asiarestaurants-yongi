import React, { useState } from 'react'
import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useEditor } from './EditorContext'
import { RequireCode } from './AccessCode'
import { createRequest, formatDateTime, getSiteName, toHost } from './api'

// Asks before sending a 'restore' request: the AI brings this older version back as a new change, so the version
// that was newest stays in the list and can be brought back the same way
const RestoreDialog = ({ open, onClose, onSent }) => {
    const { code, ref, status, oldVersion, rejectCode } = useEditor()
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    if (!oldVersion) return null

    const send = async () => {
        setSending(true)
        setError('')
        try {
            const { number } = await createRequest(code, { type: 'restore', version: oldVersion.sha, text: '', ref, page: window.location.pathname, images: [] })
            onSent(number)
        } catch (sendError) {
            setError(sendError.message)
            if (sendError.status === 401) rejectCode()
        } finally {
            setSending(false)
        }
    }

    return (
        <AlertDialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <AlertDialog.Portal>
                <AlertDialog.Backdrop className='aiwe-backdrop' />
                <AlertDialog.Popup className='aiwe-alert'>
                    <AlertDialog.Title className='aiwe-alert-title'>¿Volver a esta versión?</AlertDialog.Title>
                    <AlertDialog.Description className='aiwe-alert-text'>
                        {getSiteName(ref)} ({toHost(status.url)}) volverá a ser como en esta versión
                        {oldVersion.date && `, del ${formatDateTime(oldVersion.date)}`}, para todos los que entren. La IA lo publicará
                        como un cambio nuevo en unos minutos: la versión actual se guardará en el historial y podrás volver a ella
                        cuando quieras.
                    </AlertDialog.Description>
                    <RequireCode>
                        {error && <p className='aiwe-error' role='alert'>{error}</p>}
                        <div className='aiwe-alert-actions'>
                            <AlertDialog.Close className='aiwe-button secondary'>Cancelar</AlertDialog.Close>
                            <button type='button' className='aiwe-button' onClick={send} disabled={sending}>
                                {sending ? 'Enviando...' : 'Volver a esta versión'}
                            </button>
                        </div>
                    </RequireCode>
                </AlertDialog.Popup>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

export default RestoreDialog
