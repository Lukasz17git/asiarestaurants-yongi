import React from 'react'
import cocina from './cocinaData'
import { Link } from 'react-router-dom'
import gold from '../generateGold'
import { ioyiPhoto } from '../_new/images/ioyi/photos'
import { revealDelay } from '../_new/reveal/useReveal'

const Section4 = () => {
  const language = 'es'
  const kicker = {
    es: 'Para todos',
    cat: '',
    it: ''
  }
  // [text, highlighted end]
  const name = {
    es: ['Un bol para', 'cada uno'],
    cat: ['', ''],
    it: ['', '']
  }
  const menus = 'Ver la carta'

  return (
    <section className='section4'>
      <div className='section-header' data-reveal='up'>
        <p className='kicker'>{kicker[language]}</p>
        <h2 className='heading'>{name[language][0]} <em>{name[language][1]}</em></h2>
      </div>
      <div className='container'>
        {cocina.map(({ name, description, photo }, index) => (
          <article key={index} className='cocina' data-reveal='up' style={revealDelay(index)}>
            <img src={ioyiPhoto(photo)} alt={name[language]} loading='lazy' />
            <div className='cocina-text'>
              <h3 className='title'>{gold(name[language])}</h3>
              <p className='description'>{description[language]}</p>
            </div>
          </article>
        ))}
      </div>
      <div className='cta-buttons' data-reveal='up'>
        <Link className='cta cta-gold' to='/menu'>{menus}</Link>
      </div>
    </section>
  )
}

export default Section4
