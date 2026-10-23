import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import ImageUploader from './ImageUploader'
import { uploadImages } from './api'

// Text and images for a new request or a reply; onSend gets the uploaded images ({ name, url }) and sends
const Composer = ({ label, placeholder, sendLabel, compact, onSend, children }) => {
    const { code, rejectCode, status } = useEditor()
    const [text, setText] = useState('')
    const [images, setImages] = useState([])
    const [showImages, setShowImages] = useState(!compact)
    const [progress, setProgress] = useState('')
    const [error, setError] = useState('')

    const compressing = images.some(({ status }) => status === 'compressing')
    const readyImages = images.filter(({ status }) => status === 'ready')
    const canSend = text.trim() && !compressing && !progress

    const send = async (event) => {
        event.preventDefault()
        if (!canSend) return
        setError('')
        try {
            const uploaded = await uploadImages(code, status?.uploadFolder, readyImages, (number) => setProgress(`Subiendo imágenes ${number}/${readyImages.length}...`))
            setProgress('Enviando...')
            await onSend({ text, images: uploaded })
            images.forEach(({ preview }) => URL.revokeObjectURL(preview))
            setText('')
            setImages([])
        } catch (sendError) {
            setError(sendError.message)
            if (sendError.status === 401) rejectCode()
        } finally {
            setProgress('')
        }
    }

    return (
        <form className={compact ? 'aiwe-composer compact' : 'aiwe-composer'} onSubmit={send}>
            {children}
            <label className='aiwe-field'>
                {label && <span className='aiwe-field-label'>{label}</span>}
                <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={placeholder}
                    rows={compact ? 3 : 6}
                    maxLength={5000}
                    required
                />
            </label>
            {showImages
                ? <ImageUploader images={images} setImages={setImages} compact={compact} />
                : <button type='button' className='aiwe-link' onClick={() => setShowImages(true)}>+ Añadir imágenes</button>}
            {error && <p className='aiwe-error' role='alert'>{error}</p>}
            <div className='aiwe-composer-footer'>
                <span className='aiwe-composer-status'>
                    {progress || (compressing ? 'Optimizando imágenes...' : images.length > readyImages.length ? 'Las imágenes que no se pueden leer no se enviarán.' : '')}
                </span>
                <button type='submit' className='aiwe-button' disabled={!canSend}>{progress ? 'Enviando...' : sendLabel}</button>
            </div>
        </form>
    )
}

export default Composer
