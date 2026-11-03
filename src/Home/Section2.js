import React from 'react'
import { Link } from 'react-router-dom'
import { ioyiPhoto } from '../_new/images/ioyi/photos'
import { glovoUrl } from './delivery-link'

const Section2 = () => {

  const language = 'es'

  // [text, highlighted end]
  const title = {
    es: ['Tu ramen,', 'también en casa'],
    cat: ['', ''],
    it: ['', '']
  }
  const description = {
    es: 'Elige tus ramen, donburis y gyozas, y envíanos el pedido por WhatsApp en un minuto. Pásate a recogerlo o pídelo a domicilio, también desde Glovo.',
    cat: '',
    it: ''
  }
  const perks = {
    es: ['Recogida en Carrer de la Indústria, 7', 'Pedido directo por WhatsApp', 'También en Glovo y Just Eat'],
    cat: [],
    it: []
  }
  const buttonOrderNow = {
    es: 'Pedir online',
    cat: '',
    it: ''
  }
  const buttonGlovo = {
    es: 'Pedir en Glovo',
    cat: '',
    it: ''
  }

  return (
    <section className='section2'>
      <div className='container'>
        <div className='left' data-reveal='left'>
          <p className='kicker'>Para llevar y a domicilio</p>
          <h2 className='heading'>{title[language][0]} <em>{title[language][1]}</em></h2>
          <p className='lead'>{description[language]}</p>
          <ul className='perks'>
            {perks[language].map((perk) => <li key={perk}>{perk}</li>)}
          </ul>
          <div className='cta-buttons'>
            <Link className='cta cta-red' to='/pedidos'>{buttonOrderNow[language]}</Link>
            <a className='cta cta-gold' href={glovoUrl} target='_blank' rel='noreferrer'>{buttonGlovo[language]}</a>
          </div>
        </div>
        <div className='right' data-reveal='right'>
          <img src={ioyiPhoto('dishes/teriyaki-don')} alt='Teriyaki Chicken Don con sopa de miso' loading='lazy' />
          <div className='badge'>
            <span>持ち帰り</span>
            para llevar
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section2
