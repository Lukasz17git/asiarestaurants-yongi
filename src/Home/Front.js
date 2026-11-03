import React from 'react'
import { Link } from 'react-router-dom'
import { reservationWhatsappUrl } from '../_new/sections/reservation'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const Front = () => {
  return (
    <section className='front'>
      <div className='front-bg' />
      <span className='front-kanji' aria-hidden='true'>ラーメン</span>
      <div className='front-bowl' aria-hidden='true'>
        <div className='front-sun' />
        <img className='front-bowl-photo' src={ioyiPhoto('dishes/akamaru')} alt='' />
        <img className='front-seal' src={ioyiPhoto('seal')} alt='' />
      </div>
      <div className='front-content'>
        <img className='front-logo' src={ioyiPhoto('logo-cream')} alt='IOYI Ramen' width='600' height='261' />
        <h1 className='front-title'>Ramen japonés de <em>caldo lento</em> en Vilafranca del Penedès</h1>
        <p className='front-text'>
          Tonkotsu cremoso, tori paitan de gallina de corral, tantanmen picante y ramen vegano.
          Un pequeño local de 20 plazas que te sienta en una barra de ramen de Japón.
        </p>
        <div className='cta-buttons front-buttons'>
          <Link className='cta cta-red' to='/menu'>Ver carta</Link>
          <a className='cta cta-gold' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>Reservar mesa</a>
        </div>
        <a className='front-fomo' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>
          <span className='pulse-dot' />
          Solo 20 plazas y se llena rápido: <u>reserva la tuya</u>
        </a>
      </div>
      <div className='front-scroll'><span /></div>
    </section>
  )
}

export default Front
