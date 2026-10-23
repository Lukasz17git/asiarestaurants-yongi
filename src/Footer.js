import React from 'react'

const Footer = () => {
  const description = {
    es: '¿Estás buscando cocina japonesa o china? ¡Con Asia Restaurantes estás en el lugar correcto! Sumérgete en la cultura asiática y prueba todos nuestros platos.',
    it: 'Stai cercando cucina Giapponese e cucina Cinese a domicilio? Con Ristorante Asia sei nel posto giusto! Immergiti nella cultura asiatica e prova tutti i nostri piatti.'
  }
  const instagram = 'https://www.instagram.com/asiavilafranca/'
  const facebook = 'https://www.facebook.com/profile.php?id=100082102034055'
  const twitter = ''
  const openInstagram = () => window.open(instagram, '_blank')
  const openFacebook = () => window.open(facebook, '_blank')
  // const openTwitter = () => window.open(twitter, '_blank')
  const openTwitter = () => { }

  return (
    <div className='footer'>
      <img alt='restaurant' />
      <div className='restaurant'>
        <div className='name font2'>Asia Restaurants</div>
        <div className='description font3 grey'>{description.es}</div>
      </div>
      <div className='buttons'>
        <div className='button' onClick={openInstagram}>
          <div className='instagram' />
          <div className='text' >Instagram</div>
        </div>
        <div className='button' onClick={openFacebook}>
          <div className='facebook' />
          <div className='text' >Facebook</div>
        </div>
        <div className='button' onClick={openTwitter}>
          <div className='twitter' />
          <div className='text' >Twitter</div>
        </div>
      </div>
      <div className='copy font3'>© 2022 Asia Restaurants. All Rights Reserved</div>
    </div>
  )
}

export default Footer