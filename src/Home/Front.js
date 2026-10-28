import React from 'react'
import { Link } from 'react-router-dom'
import gold from '../generateGold'
import { reservationWhatsappUrl } from '../_new/sections/reservation'

const Front = () => {
  return (
    <section className='front'>
      <div className='front-bg' />
      <div className='front-sun' />
      <img className='front-float front-float-right' src={require('../images/mealsNoBg/meal12.webp')} alt='' />
      <img className='front-float front-float-left' src={require('../images/mealsNoBg/meal25.webp')} alt='' />
      <div className='front-content'>
        <div className='front-logo' />
        <div className='front-brand'>{gold('Asia Oriental Taste')}</div>
        <h1 className='front-title'>Restaurante de <em>sushi</em>, cocina japonesa y china en Vilafranca del Penedès</h1>
        <p className='front-text'>
          Uramakis que crujen, ramen humeante, gua bao esponjosos y un Golden Lobster Roll con hojas de oro.
          Más de 200 platos de Asia para venir en pareja, con amigos o con toda la familia.
        </p>
        <div className='cta-buttons front-buttons'>
          <Link className='cta cta-red' to='/menu'>Ver carta</Link>
          <Link className='cta cta-gold' to='/pedidos'>Pedir online</Link>
        </div>
        <a className='front-fomo' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>
          <span className='pulse-dot' />
          Mesas limitadas el fin de semana: <u>reserva la tuya</u>
        </a>
      </div>
      <div className='front-scroll'><span /></div>
    </section>
  )
}

export default Front
