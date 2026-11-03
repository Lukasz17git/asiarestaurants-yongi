import React from 'react'
import { revealDelay } from '../reveal/useReveal'
import './sections.css'

// What the public reviews repeat most, summed up in our words (no quotes or names)
const reviewThemes = [
    { title: 'Caldos de horas', text: 'Lo que más se repite: caldos profundos, cocinados durante horas, nada que ver con un ramen instantáneo.' },
    { title: 'Como en Japón', text: 'Clientes que han viajado a Japón lo ponen entre los mejores ramen que han probado.' },
    { title: 'Un trato cercano', text: 'El equipo explica cada plato, aconseja y adapta el bol a lo que necesites.' },
    { title: 'Sin gluten y vegano', text: 'Opciones sin gluten con cuidado de la contaminación cruzada, y un ramen 100 % vegano.' },
    { title: 'El postre, también', text: 'El mochi de Oreo y la leche de coco con tapioca, el final que más se recomienda.' },
    { title: 'Mejor con reserva', text: 'Es un local pequeño y se llena rápido, sobre todo por la noche.' },
]

const Reviews = () => {
    return (
        <section className='reviews'>
            <div className='reviews-score' data-reveal='left'>
                <span className='reviews-number'>4,7</span>
                <span className='reviews-stars' aria-label='4,7 de 5 estrellas'>★★★★★</span>
                <span className='reviews-count'>de media en más de 360 reseñas</span>
            </div>
            <div className='reviews-content'>
                <div className='section-header' data-reveal='up'>
                    <p className='kicker'>Lo que dicen de nosotros</p>
                    <h2 className='heading'>Lo que más repiten <em>nuestros clientes</em></h2>
                </div>
                <ul className='reviews-themes'>
                    {reviewThemes.map(({ title, text }, index) => (
                        <li key={title} data-reveal='up' style={revealDelay(index % 3)}>
                            <span className='reviews-theme-number'>0{index + 1}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>
                <p className='reviews-note'>Resumen de las reseñas públicas del restaurante.</p>
            </div>
        </section>
    )
}

export default Reviews
