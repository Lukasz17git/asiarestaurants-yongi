import React from 'react'
import Roulette from '../Roulette'
import gold from '../generateGold'
// import { deliveryLink } from './delivery-link'

const Section2 = () => {

  const language = 'es'

  const title = {
    es: 'Pide a Domicilio',
    cat: '',
    it: 'Ordina a Domiclio'
  }
  const description = {
    es: 'Pide a casa y recibe además promociones adicionales!',
    cat: '',
    it: 'Ordina e ricevi le nostre spcialita a casa tua!'
  }
  const buttonViewCard = {
    es: 'Ver carta!',
    cat: '',
    it: ''
  }
  // const buttonOderNow = {
  //   es: 'Pide online ahora!',
  //   cat: '',
  //   it: ''
  // }


  return (
    <div className='section2'>
      <div className='container'>
        <div className='left'>
          <div className='name'>Asia Delivery</div>
          <div className='title'>{gold(title[language])}</div>
          <div className='description font4'>{description[language]}</div>
          {/* <div className='button button-red'>
            <a href={deliveryLink} >
              {buttonOderNow[language]}
            </a>
          </div> */}
          <div className='button'>
            <a href='./pdfs/CartaLlevar2024_compressed.pdf' target='blank' >
              {buttonViewCard[language]}
            </a>
          </div>
        </div>
        <div className='right' >
          <Roulette />
        </div>
      </div>
    </div>
  )
}

export default Section2
