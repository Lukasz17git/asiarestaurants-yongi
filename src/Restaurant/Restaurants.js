import React, { useRef } from 'react'
import Footer from '../Footer'
import '../css/Restaurant.css'
import restaurants from './restaurantsData'
import Restaurant from './Restaurant'
import { useReveal } from '../_new/reveal/useReveal'

const Restaurants = () => {
  const language = 'es'
  const pageRef = useRef(null)
  useReveal(pageRef)
  const name = 'IOYI Ramen'.toUpperCase().split('')

  const restaurantsTitle = {
    es: 'Un pequeño ramen-ya en el centro de Vilafranca del Penedès',
    cat: '',
    it: ''
  }

  return (
    <div className='main-restaurant' ref={pageRef}>
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
      <Restaurant data={restaurants.ioyi} />
      <Footer />
    </div>
  )
}

export default Restaurants