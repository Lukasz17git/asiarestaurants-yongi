import React from 'react'
import { Link } from 'react-router-dom'
import gold from '../generateGold'
import { addressText, hoursText, phoneText, phoneUrl, reservationWhatsappUrl } from '../_new/sections/reservation'

// Like a magazine cover: the name across the page, the Golden Lobster Roll on it and the key facts in a bar
const Front = () => {
  return (
    <section className='front'>
      <div className='front-top'>
        <div className='front-brand'>{gold('Asia Oriental Taste')}</div>
        <a className='front-fomo' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>
          <span className='pulse-dot' />
          Mesas limitadas el fin de semana: <u>reserva la tuya</u>
        </a>
      </div>
      <div className='front-banner' aria-hidden='true'>
        <span>創業</span>
        <b>2006</b>
      </div>
      <div className='front-cover'>
        <div className='front-wordmark' aria-hidden='true'>
          {['A', 'S', 'I', 'A'].map((letter, index) => <span key={index}>{letter}</span>)}
        </div>
        <figure className='front-dish'>
          <img src={require('../images/mealsNoBg/meal10.webp')} alt='Golden Lobster Roll' />
          {/* Price from takeaway-menu.json */}
          <figcaption className='front-dish-label'>Golden Lobster Roll <b>18 €</b></figcaption>
        </figure>
      </div>
      <div className='front-bottom'>
        <h1 className='front-title'>Restaurante de <em>sushi</em>, cocina japonesa y china en Vilafranca del Penedès</h1>
        <div className='front-side'>
          <p className='front-text'>
            Uramakis que crujen, ramen humeante, gua bao esponjosos y más de 200 platos de Asia para venir en pareja,
            con amigos o con toda la familia.
          </p>
          <div className='cta-buttons front-buttons'>
            <Link className='cta cta-red' to='/pedidos'>Pedir online</Link>
            <Link className='cta cta-gold' to='/menu'>Ver carta</Link>
          </div>
        </div>
      </div>
      <ul className='front-info'>
        <li><small>Horario</small>{hoursText}</li>
        <li><small>Dónde</small><Link to='/restaurant'>{addressText}</Link></li>
        <li><small>Reseñas</small>4,2 ★ en más de 500</li>
        <li><small>Teléfono</small><a href={phoneUrl}>{phoneText}</a></li>
      </ul>
    </section>
  )
}

export default Front
