import React from 'react'
import { Link } from 'react-router-dom'
import menus from '../../Menu/MenusData'
import { revealDelay } from '../reveal/useReveal'
import { reservationWhatsappUrl } from './reservation'
import './sections.css'

const MenusTeaser = () => {
    const language = 'es'
    const { day, night } = menus
    const teaserMenus = [{ ...day, icon: 'is-day' }, { ...night, icon: 'is-night' }]

    return (
        <section className='menus-teaser'>
            <div className='section-header' data-reveal='up'>
                <p className='kicker'>Nuestros menús</p>
                <h2 className='heading'>Menús desde <em>{day.price}</em></h2>
                <p className='lead'>Sushi, cocina japonesa y china para comer sin mirar el reloj. Elige tu momento y deja hueco para otra ronda.</p>
            </div>
            <div className='menus-teaser-cards'>
                {teaserMenus.map(({ name, time, price, price2, pdf, icon }, index) => (
                    <a key={pdf} className='menus-teaser-card' href={pdf} target='_blank' rel='noreferrer' data-reveal='up' style={revealDelay(index, 0.15)}>
                        <span className={'menus-teaser-icon ' + icon} />
                        <span className='menus-teaser-name'>{name[language]}</span>
                        <span className='menus-teaser-time'>{time[language]}</span>
                        <span className='menus-teaser-price'>{price}</span>
                        {price2 && <span className='menus-teaser-note'>{price2}</span>}
                        <span className='menus-teaser-link'>Ver carta</span>
                    </a>
                ))}
            </div>
            <div className='cta-buttons' data-reveal='up'>
                <Link className='cta cta-red' to='/menu'>Ver menús</Link>
                <a className='cta cta-gold' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>Reservar mesa</a>
            </div>
        </section>
    )
}

export default MenusTeaser
