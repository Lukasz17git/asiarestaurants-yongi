import React from 'react'
import { Link } from 'react-router-dom'

const Section2 = () => {

  const language = 'es'

  // [text, highlighted end]
  const title = {
    es: ['¿Antojo ahora?', 'Te lo llevamos'],
    cat: ['', ''],
    it: ['', '']
  }
  const description = {
    es: 'Pide online en un minuto y recibe en casa tu sushi, tus fideos y tus gua bao recién hechos. Comida asiática a domicilio en Vilafranca del Penedès o para recoger en el restaurante.',
    cat: '',
    it: 'Ordina e ricevi le nostre spcialita a casa tua!'
  }
  const perks = {
    es: ['Envío gratis en Vilafranca (08720) desde 20 €', 'Recogida sin pedido mínimo', 'Pedido directo por WhatsApp'],
    cat: [],
    it: []
  }
  const buttonOrderNow = {
    es: 'Pedir online',
    cat: '',
    it: ''
  }
  const buttonViewCard = {
    es: 'Carta para llevar',
    cat: '',
    it: ''
  }

  return (
    <section className='section2'>
      <div className='container'>
        <div className='left' data-reveal='left'>
          <p className='kicker'>Asia Delivery</p>
          <h2 className='heading'>{title[language][0]} <em>{title[language][1]}</em></h2>
          <p className='lead'>{description[language]}</p>
          <ul className='perks'>
            {perks[language].map((perk) => <li key={perk}>{perk}</li>)}
          </ul>
          <div className='cta-buttons'>
            <Link className='cta cta-red' to='/pedidos'>{buttonOrderNow[language]}</Link>
            <a className='cta cta-gold' href='./pdfs/CartaLlevar2024_compressed.pdf' target='_blank' rel='noreferrer'>{buttonViewCard[language]}</a>
          </div>
        </div>
        <div className='right' data-reveal='right'>
          <img src={require('../images/menus/takeAway.webp')} alt='Sushi para llevar de Asia Oriental Taste' loading='lazy' />
          <div className='badge'>
            <span>Gratis</span>
            envío desde 20 €
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section2
