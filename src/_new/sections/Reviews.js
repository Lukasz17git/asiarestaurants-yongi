import React from 'react'
import { revealDelay } from '../reveal/useReveal'
import './sections.css'

// What the public reviews repeat most, summed up in our words (no quotes or names)
const reviewThemes = [
    { title: 'Pescado fresco', text: 'Lo que más se repite: pescado fresco y sushi, sashimi y rolls cortados al momento.' },
    { title: 'El sushi de la zona', text: 'Hay clientes que lo ponen como el mejor sushi de la zona.' },
    { title: 'Calidad y precio', text: 'Una relación calidad-precio que muchos llaman inmejorable.' },
    { title: 'Un trato atento', text: 'Un equipo amable y atento, pendiente de cada mesa.' },
    { title: 'Un sitio tranquilo', text: 'Un ambiente agradable y tranquilo, para venir en pareja o en familia.' },
    { title: 'Para todos los gustos', text: 'Más de 200 platos: de los uramakis y el ramen al wok y el dim sum.' },
]

const Reviews = () => {
    return (
        <section className='reviews'>
            <div className='reviews-score' data-reveal='left'>
                <span className='reviews-number'>4,2</span>
                <span className='reviews-stars' aria-label='4,2 de 5 estrellas'>★★★★☆</span>
                <span className='reviews-count'>de media en más de 500 reseñas</span>
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
