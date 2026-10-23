import React, { useRef, useState } from 'react'
import { AlertDialog } from '@base-ui/react/alert-dialog'
import imageCompression from 'browser-image-compression'
import ImagePreview from './ImagePreview'

export const maxImages = 20

// WebP keeps the transparency of dish photos; 1600px is twice what the site shows
const compressionOptions = { maxWidthOrHeight: 1600, maxSizeMB: 0.6, fileType: 'image/webp', initialQuality: 0.82 }

const formatSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`)

const createId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

const ImageCard = ({ image, onRename, onOpen, onRemove }) => (
    <li className={`aiwe-image-card ${image.status}`}>
        <button type='button' className='aiwe-thumb' onClick={onOpen} aria-label={`Ver ${image.name} en grande`}>
            {image.preview && <img src={image.preview} alt='' />}
            {image.status === 'compressing' && <span className='aiwe-badge'>Optimizando...</span>}
            {image.status === 'error' && <span className='aiwe-badge error'>No se puede leer</span>}
        </button>
        <input
            className='aiwe-image-name'
            value={image.name}
            maxLength={80}
            onChange={(event) => onRename(event.target.value)}
            aria-label='Nombre de la imagen'
            placeholder='Nombre de la imagen'
        />
        <span className='aiwe-image-size'>
            {image.file ? `${formatSize(image.file.size)} · antes ${formatSize(image.originalSize)}` : formatSize(image.originalSize)}
        </span>
        <button type='button' className='aiwe-image-remove' onClick={onRemove} aria-label={`Quitar ${image.name}`}>×</button>
    </li>
)

const RemoveDialog = ({ image, onConfirm, onCancel }) => (
    <AlertDialog.Root open={Boolean(image)} onOpenChange={(open) => !open && onCancel()}>
        <AlertDialog.Portal>
            <AlertDialog.Backdrop className='aiwe-backdrop' />
            <AlertDialog.Popup className='aiwe-alert'>
                <AlertDialog.Title className='aiwe-alert-title'>¿Quitar «{image?.name}»?</AlertDialog.Title>
                <AlertDialog.Description className='aiwe-alert-text'>La imagen se quitará de esta petición.</AlertDialog.Description>
                <div className='aiwe-alert-actions'>
                    <AlertDialog.Close className='aiwe-button secondary'>Cancelar</AlertDialog.Close>
                    <button type='button' className='aiwe-button danger' onClick={onConfirm}>Quitar</button>
                </div>
            </AlertDialog.Popup>
        </AlertDialog.Portal>
    </AlertDialog.Root>
)

// Drop zone and grid of up to 20 images, each compressed as soon as it's added, with its own name
const ImageUploader = ({ images, setImages, compact }) => {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState(false)
    const [notice, setNotice] = useState('')
    const [previewIndex, setPreviewIndex] = useState(null)
    const [removeId, setRemoveId] = useState(null)

    const updateImage = (id, changes) => setImages((current) => current.map((image) => (image.id === id ? { ...image, ...changes } : image)))

    const compress = async (id, original) => {
        try {
            const file = await imageCompression(original, compressionOptions)
            const preview = URL.createObjectURL(file)
            setImages((current) => current.map((image) => {
                if (image.id !== id) return image
                URL.revokeObjectURL(image.preview)
                return { ...image, file, preview, status: 'ready' }
            }))
        } catch {
            updateImage(id, { status: 'error' })
        }
    }

    const addFiles = (fileList) => {
        const files = [...fileList].filter((file) => file.type.startsWith('image/'))
        const room = maxImages - images.length
        const added = files.slice(0, room).map((file) => ({
            id: createId(),
            name: file.name.replace(/\.[^.]+$/, ''),
            originalSize: file.size,
            preview: URL.createObjectURL(file),
            file: null,
            status: 'compressing',
        }))
        setNotice(files.length > room ? `Puedes añadir hasta ${maxImages} imágenes: ${files.length - room} no se han añadido.` : '')
        setImages((current) => [...current, ...added])
        added.forEach((image, index) => compress(image.id, files[index]))
    }

    const removeImage = () => {
        setImages((current) => current.filter((image) => {
            if (image.id !== removeId) return true
            URL.revokeObjectURL(image.preview)
            return false
        }))
        setRemoveId(null)
        setNotice('')
    }

    const onDrop = (event) => {
        event.preventDefault()
        setDragging(false)
        addFiles(event.dataTransfer.files)
    }

    const full = images.length >= maxImages

    return (
        <div className={compact ? 'aiwe-uploader compact' : 'aiwe-uploader'}>
            <input
                ref={inputRef}
                type='file'
                accept='image/*'
                multiple
                hidden
                onChange={(event) => {
                    addFiles(event.target.files)
                    event.target.value = ''
                }}
            />
            {!full && (
                <button
                    type='button'
                    className={dragging ? 'aiwe-dropzone dragging' : 'aiwe-dropzone'}
                    onClick={() => inputRef.current.click()}
                    onDragOver={(event) => {
                        event.preventDefault()
                        setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                >
                    <span className='aiwe-dropzone-icon' aria-hidden='true'>+</span>
                    <span className='aiwe-dropzone-title'>{images.length ? 'Añadir más imágenes' : 'Añade imágenes'}</span>
                    <span className='aiwe-dropzone-hint'>Arrástralas aquí o pulsa para elegirlas · {images.length}/{maxImages} · se optimizan solas</span>
                </button>
            )}
            {notice && <p className='aiwe-notice'>{notice}</p>}
            {images.length > 0 && (
                <ul className='aiwe-image-grid'>
                    {images.map((image, index) => (
                        <ImageCard
                            key={image.id}
                            image={image}
                            onRename={(name) => updateImage(image.id, { name })}
                            onOpen={() => image.status !== 'error' && setPreviewIndex(index)}
                            onRemove={() => setRemoveId(image.id)}
                        />
                    ))}
                </ul>
            )}
            <ImagePreview
                images={images.map(({ name, preview }) => ({ name, url: preview }))}
                index={previewIndex}
                onIndexChange={setPreviewIndex}
            />
            <RemoveDialog image={images.find(({ id }) => id === removeId)} onConfirm={removeImage} onCancel={() => setRemoveId(null)} />
        </div>
    )
}

export default ImageUploader
