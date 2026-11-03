import React from 'react'
import { instagramUrl } from './_new/sections/reservation'

const Footer = () => {
  const description = {
    es: 'Ramen japonés de caldo lento en Vilafranca del Penedès. Un pequeño local de 20 plazas, para comer aquí, para llevar o a domicilio.',
  }
  const openInstagram = () => window.open(instagramUrl, '_blank')

  return (
    <div className='footer'>
      <img alt='restaurant' />
      <div className='restaurant'>
        <div className='name font2'>IOYI Ramen</div>
        <div className='description font3 grey'>{description.es}</div>
      </div>
      <div className='buttons'>
        <div className='button' onClick={openInstagram}>
          <div className='instagram' />
          <div className='text' >@ioyiramen</div>
        </div>
      </div>
      <div className='copy font3'>© 2026 IOYI Ramen · Carrer de la Indústria, 7 · Vilafranca del Penedès</div>
    </div>
  )
}

export default Footer