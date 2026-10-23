import React, { useState } from 'react'
import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useEditor } from './EditorContext'
import { RequireCode } from './AccessCode'
import { createRequest, getSiteName } from './api'
import { getPagePath } from './versionPath'

// Asks before sending a 'promote' request: the AI merges this design's branch into the main web
const PromoteDialog = ({ open, onClose, onSent }) => {
    const { code, ref, rejectCode } = useEditor()
    const [note, setNote] = useState('')
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    const name = getSiteName(ref)

    const send = async () => {
        setSending(true)
        setError('')
        try {
            const { number } = await createRequest(code, { type: 'promote', text: note, ref, page: getPagePath() })
            setNote('')
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
                    <AlertDialog.Title className='aiwe-alert-title'>¿Usar «{name}» como web principal?</AlertDialog.Title>
                    <AlertDialog.Description className='aiwe-alert-text'>
                        La IA pasará todos los cambios de este diseño a la web principal. El diseño seguirá existiendo en su dirección.
                    </AlertDialog.Description>
                    <RequireCode>
                        <label className='aiwe-field'>
                            <span className='aiwe-field-label'>¿Algo que la IA deba saber? (opcional)</span>
                            <textarea
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                placeholder='Ejemplo: mantener los precios actuales de la web principal'
                                rows={3}
                                maxLength={5000}
                            />
                        </label>
                        {error && <p className='aiwe-error' role='alert'>{error}</p>}
                        <div className='aiwe-alert-actions'>
                            <AlertDialog.Close className='aiwe-button secondary'>Cancelar</AlertDialog.Close>
                            <button type='button' className='aiwe-button' onClick={send} disabled={sending}>
                                {sending ? 'Enviando...' : 'Usar como principal'}
                            </button>
                        </div>
                    </RequireCode>
                </AlertDialog.Popup>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

export default PromoteDialog
