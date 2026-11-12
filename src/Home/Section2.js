import React from 'react'
import { Link } from 'react-router-dom'
import { revealDelay } from '../_new/reveal/useReveal'

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
  // How «Pedir online» works, numbered in kanji
  const steps = {
    es: [
      { kanji: '一', title: 'Elige tus platos', text: 'Sushi, wok, gua bao… toda la carta para llevar, con sus fotos y precios.' },
      { kanji: '二', title: 'Envíalo por WhatsApp', text: 'Tu pedido llega escrito al restaurante, sin apps ni registros.' },
      { kanji: '三', title: 'Te lo llevamos o lo recoges', text: 'Envío gratis en Vilafranca (08720) desde 20 €; recogida sin pedido mínimo.' },
    ],
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
        <div className='delivery-header' data-reveal='up'>
          <div>
            <p className='kicker'>Asia Delivery</p>
            <h2 className='heading'>{title[language][0]} <em>{title[language][1]}</em></h2>
          </div>
          <p className='lead'>{description[language]}</p>
        </div>
        <ol className='delivery-steps'>
          {steps[language].map(({ kanji, title, text }, index) => (
            <li key={kanji} data-reveal='up' style={revealDelay(index, 0.15)}>
              <span className='delivery-kanji' aria-hidden='true'>{kanji}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className='cta-buttons' data-reveal='up'>
          <Link className='cta cta-red' to='/pedidos'>{buttonOrderNow[language]}</Link>
          <a className='cta cta-gold' href='./pdfs/CartaLlevar2024_compressed.pdf' target='_blank' rel='noreferrer'>{buttonViewCard[language]}</a>
        </div>
      </div>
    </section>
  )
}

export default Section2
