import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import ImageUploader from './ImageUploader'
import { uploadImages } from './api'

// One box per kind of image (the keys of the payload and of status.uploadFolders)
const imageBoxes = [
    {
        kind: 'references',
        title: 'Imágenes de referencia',
        note: 'Para que la IA vea lo que quieres decir; no se ponen en la web y se borran a los 7 días.',
    },
    // Hidden for now: images the AI puts on the website, kept for good
    // {
    //     kind: 'assets',
    //     title: 'Imágenes para la web',
    //     note: 'La IA las pone en la web, donde le digas.',
    // },
]

const noImages = { references: [], assets: [] }

// Text and images for a new request or a reply; onSend gets the uploaded images of each kind ({ name, url }) and sends
const Composer = ({ label, placeholder, sendLabel, compact, onSend, children }) => {
    const { code, rejectCode, status } = useEditor()
    const [text, setText] = useState('')
    const [images, setImages] = useState(noImages)
    const [showImages, setShowImages] = useState(!compact)
    const [progress, setProgress] = useState('')
    const [error, setError] = useState('')

    const allImages = Object.values(images).flat()
    const compressing = allImages.some(({ status }) => status === 'compressing')
    const readyImages = Object.entries(images).flatMap(([kind, group]) => group.filter(({ status }) => status === 'ready').map((image) => ({ ...image, kind })))
    const canSend = text.trim() && !compressing && !progress

    // ImageUploader only calls it with a function, like setState
    const setKindImages = (kind) => (update) => setImages((current) => ({ ...current, [kind]: update(current[kind]) }))

    const send = async (event) => {
        event.preventDefault()
        if (!canSend) return
        setError('')
        try {
            const uploaded = await uploadImages(code, status?.uploadFolders, readyImages, (number) => setProgress(`Subiendo imágenes ${number}/${readyImages.length}...`))
            const ofKind = (kind) => uploaded.filter((image) => image.kind === kind)
            setProgress('Enviando...')
            await onSend({ text, references: ofKind('references'), assets: ofKind('assets') })
            allImages.forEach(({ preview }) => URL.revokeObjectURL(preview))
            setText('')
            setImages(noImages)
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
                ? imageBoxes.map(({ kind, title, note }) => (
                    <ImageUploader key={kind} title={title} note={note} images={images[kind]} setImages={setKindImages(kind)} compact={compact} />
                ))
                : <button type='button' className='aiwe-link' onClick={() => setShowImages(true)}>+ Añadir imágenes</button>}
            {error && <p className='aiwe-error' role='alert'>{error}</p>}
            <div className='aiwe-composer-footer'>
                <span className='aiwe-composer-status'>
                    {progress || (compressing ? 'Optimizando imágenes...' : allImages.length > readyImages.length ? 'Las imágenes que no se pueden leer no se enviarán.' : '')}
                </span>
                <button type='submit' className='aiwe-button' disabled={!canSend}>{progress ? 'Enviando...' : sendLabel}</button>
            </div>
        </form>
    )
}

export default Composer
