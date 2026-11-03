import React from 'react'
import { Link } from 'react-router-dom'
import menus from '../../Menu/MenusData'
import { revealDelay } from '../reveal/useReveal'
import './sections.css'

const MenusTeaser = () => {
    const language = 'es'
    const { day, carta } = menus
    const teaserMenus = [{ ...day, icon: 'is-day' }, { ...carta, icon: 'is-night' }]

    return (
        <section className='menus-teaser'>
            <div className='section-header' data-reveal='up'>
                <p className='kicker'>Menú y carta</p>
                <h2 className='heading'>Ramen desde <em>12,95€</em></h2>
                <p className='lead'>Menú del día entre semana o la carta completa a mediodía y por la noche. Elige tu momento y deja hueco para el mochi.</p>
            </div>
            <div className='menus-teaser-cards'>
                {teaserMenus.map(({ name, time, price, price2, icon }, index) => (
                    <Link key={icon} className='menus-teaser-card' to='/menu' data-reveal='up' style={revealDelay(index, 0.15)}>
                        <span className={'menus-teaser-icon ' + icon} />
                        <span className='menus-teaser-name'>{name[language]}</span>
                        <span className='menus-teaser-time'>{time[language]}</span>
                        <span className='menus-teaser-price'>{price}</span>
                        {price2 && <span className='menus-teaser-note'>{price2}</span>}
                        <span className='menus-teaser-link'>Ver carta</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default MenusTeaser
