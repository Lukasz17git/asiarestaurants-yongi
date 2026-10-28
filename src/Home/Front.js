import React from 'react'
import { Link } from 'react-router-dom'
import gold from '../generateGold'
import { reservationWhatsappUrl } from '../_new/sections/reservation'

// Golden Roll, Rainbow Roll and Ramen on the left; Nigiri, Tartar and Gua Bao on the right
const floatingDishes = ['meal10', 'meal12', 'meal27', 'meal25', 'meal21', 'meal22']

const Front = () => {
  return (
    <section className='front'>
      <div className='front-bg' />
      <div className='front-sun' />
      {floatingDishes.map((photo, index) => (
        <img key={photo} className={`front-float front-float-${index + 1}`} src={require(`../images/mealsNoBg/${photo}.webp`)} alt='' />
      ))}
      <div className='front-content'>
        <div className='front-logo' />
        <div className='front-brand'>{gold('Asia Oriental Taste')}</div>
        <h1 className='front-title'>Restaurante de <em>sushi</em>, cocina japonesa y china en Vilafranca del Penedès</h1>
        <p className='front-text'>
          Uramakis que crujen, ramen humeante, gua bao esponjosos y un Golden Lobster Roll con hojas de oro.
          Más de 200 platos de Asia para venir en pareja, con amigos o con toda la familia.
        </p>
        <div className='cta-buttons front-buttons'>
          <Link className='cta cta-gold' to='/menu'>Ver carta</Link>
          <Link className='cta cta-red' to='/pedidos'>Pedir online</Link>
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
