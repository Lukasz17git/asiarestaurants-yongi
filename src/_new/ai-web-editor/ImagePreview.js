import React from 'react'
import { Dialog } from '@base-ui/react/dialog'
import Icon from './Icon'

// One image of `images` in large, with previous/next; closed while `index` is null
const ImagePreview = ({ images, index, onIndexChange }) => {
    const image = index === null ? null : images[index]
    const hasSeveral = images.length > 1
    const move = (step) => onIndexChange((index + step + images.length) % images.length)

    return (
        <Dialog.Root open={Boolean(image)} onOpenChange={(open) => !open && onIndexChange(null)}>
            <Dialog.Portal>
                <Dialog.Backdrop className='aiwe-backdrop dark' />
                <Dialog.Popup
                    className='aiwe-preview'
                    onKeyDown={(event) => {
                        if (!hasSeveral) return
                        if (event.key === 'ArrowRight') move(1)
                        if (event.key === 'ArrowLeft') move(-1)
                    }}
                >
                    <Dialog.Title className='aiwe-preview-title'>{image?.name}</Dialog.Title>
                    <Dialog.Close className='aiwe-icon-button aiwe-preview-close' aria-label='Cerrar'>
                        <Icon name='close' />
                    </Dialog.Close>
                    {image && <img src={image.url} alt={image.name} />}
                    {hasSeveral && (
                        <>
                            <button type='button' className='aiwe-preview-nav previous' onClick={() => move(-1)} aria-label='Imagen anterior'>‹</button>
                            <button type='button' className='aiwe-preview-nav next' onClick={() => move(1)} aria-label='Imagen siguiente'>›</button>
                            <span className='aiwe-preview-count'>{index + 1} / {images.length}</span>
                        </>
                    )}
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ImagePreview
