import React, { useRef } from 'react'
import Footer from '../Footer'
import '../css/Restaurant.css'
import restaurants from './restaurantsData'
import Restaurant from './Restaurant'
import { useReveal } from '../_new/reveal/useReveal'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const Restaurants = () => {
  const language = 'es'
  const pageRef = useRef(null)
  useReveal(pageRef)

  // [text, highlighted, text]
  const restaurantsTitle = {
    es: ['Un pequeño', 'ramen-ya', 'en el centro de Vilafranca'],
    cat: ['', '', ''],
    it: ['', '', '']
  }
  const [titleStart, titleHighlight, titleEnd] = restaurantsTitle[language]

  return (
    <div className='main-restaurant' ref={pageRef}>
      <div className='bg-wrapper'>
        <section className='restaurant-hero'>
          <div className='restaurant-hero-photo' />
          <div className='restaurant-hero-lantern' aria-hidden='true'>
            <span className='lantern-cap' />
            <span className='lantern-body'>ラーメン</span>
            <span className='lantern-cap' />
            <span className='lantern-tassel' />
          </div>
          <img className='restaurant-hero-seal' src={ioyiPhoto('seal')} alt='' />
          <div className='restaurant-hero-content' data-reveal='up'>
            <p className='kicker'>Nuestro local</p>
            <h1 className='heading'>{titleStart} <em>{titleHighlight}</em> {titleEnd}</h1>
          </div>
        </section>
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