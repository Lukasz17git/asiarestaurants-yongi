import React from 'react'
import { ioyiPhoto } from '../images/ioyi/photos'
import './sections.css'

const topRowPhotos = ['dishes/akamaru', 'place/noodle-lift', 'dishes/unagi-don', 'dishes/takoyaki', 'place/ramen-bar', 'dishes/tantanmen', 'dishes/katsu-sando', 'place/counter-food', 'dishes/mazesoba', 'dishes/okonomiyaki']
const bottomRowPhotos = ['place/ioyi-cover', 'dishes/tori-paitan', 'dishes/karaage', 'place/shop-night', 'dishes/bao-chashu', 'dishes/wagyu-burger', 'place/chopsticks-bowl', 'dishes/tsukemen', 'dishes/gyoza-chicken', 'place/red-awning', 'dishes/teriyaki-don']

// The place/ photos but ioyi-cover show other ramen bars, so their alt doesn't name IOYI
const getAlt = (photo) => (photo.startsWith('dishes/') || photo === 'place/ioyi-cover' ? 'Plato de IOYI Ramen' : 'Ambiente de ramen japonés')

// Each row is written twice so it moves in a loop without a gap
const GalleryRow = ({ photos, isReverse }) => {
    const loopedPhotos = [...photos, ...photos]

    return (
        <div className={isReverse ? 'gallery-row is-reverse' : 'gallery-row'}>
            <div className='gallery-track'>
                {loopedPhotos.map((photo, index) => (
                    <img key={index} src={ioyiPhoto(photo)} alt={index < photos.length ? getAlt(photo) : ''} loading='lazy' width='480' height='480' />
                ))}
            </div>
        </div>
    )
}

const Gallery = () => {
    return (
        <section className='gallery'>
            <div className='section-header' data-reveal='up'>
                <p className='kicker'>Hambre a primera vista</p>
                <h2 className='heading'>Boles que entran <em>por los ojos</em></h2>
                <p className='lead'>Así salen de nuestra cocina cada día: caldos humeantes, chashu dorado y huevos marinados con la yema justo en su punto.</p>
            </div>
            <GalleryRow photos={topRowPhotos} />
            <GalleryRow photos={bottomRowPhotos} isReverse />
        </section>
    )
}

export default Gallery
