import React from 'react'
import Footer from '../Footer'
import '../css/Restaurant.css'
import restaurants from './restaurantsData'
import Restaurant from './Restaurant'

const Restaurants = () => {
  const language = 'es'
  const name = 'Asia Restaurantes'.toUpperCase().split('')
  const { corregio, reggioEmilia, ravenna, orientalTaste } = restaurants

  const restaurantsTitle = {
    es: 'Con pasión y cuidadoso detalle desde el 2006',
    cat: '',
    it: 'Passione e cura del dettaglio dal 2006'
  }

  return (
    <div className='main-restaurant'>
      <div className='bg-wrapper'>
        <div className='title-menu'>
          {name.map((letter, index) => <div key={index} className='letter' style={{ transform: `translate(-50%,-50%) rotate(${index * (160 / (name.length - 1)) - 80}deg)` }}>{letter}</div>)}
          <div className='logo' />
        </div>
        <div className='restaurant-title'>{restaurantsTitle[language]}</div>
        <div className='menu-top'>
          <div className='line' />
          <div className='icon' />
          <div className='line' />
        </div>
      </div>
      <Restaurant data={orientalTaste}/>
      <div className='section-line' /><span />
      <Restaurant data={reggioEmilia} />
      <div className='section-line' /><span />
      <Restaurant data={ravenna} />
      <div className='section-line' /><span />
      <Restaurant data={corregio} />
      <Footer />
    </div>
  )
}

export default Restaurants