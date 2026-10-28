import React from 'react'
import './sections.css'

const topRowPhotos = ['home/home1', 'home/home3', 'home/home15', 'home/home7', 'home/home18', 'home/home5', 'menus/allyoucaneat2', 'home/home11', 'home/home9', 'home/home13']
const bottomRowPhotos = ['home/home12', 'home/home2', 'menus/allyoucaneat1', 'home/home4', 'home/home16', 'home/home8', 'menus/allyoucaneat3', 'home/home6', 'home/home17', 'home/home10', 'home/home14']

const photoSource = (photo) => require(`../../images/${photo}.webp`)

// Each row is written twice so it moves in a loop without a gap
const GalleryRow = ({ photos, isReverse }) => {
    const loopedPhotos = [...photos, ...photos]

    return (
        <div className={isReverse ? 'gallery-row is-reverse' : 'gallery-row'}>
            <div className='gallery-track'>
                {loopedPhotos.map((photo, index) => (
                    <img key={index} src={photoSource(photo)} alt={index < photos.length ? 'Plato de Asia Oriental Taste' : ''} loading='lazy' width='720' height='480' />
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
                <h2 className='heading'>Platos que entran <em>por los ojos</em></h2>
                <p className='lead'>Así salen de nuestra cocina cada día: sushi recién cortado, ramen humeante y dim sum al vapor. ¿Cuál te pides primero?</p>
            </div>
            <GalleryRow photos={topRowPhotos} />
            <GalleryRow photos={bottomRowPhotos} isReverse />
        </section>
    )
}

export default Gallery
