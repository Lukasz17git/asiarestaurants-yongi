import React from 'react'
import cocina from './cocinaData'
import { Link } from 'react-router-dom'
import gold from '../generateGold'
import { revealDelay } from '../_new/reveal/useReveal'

const Section4 = () => {
  const language = 'es'
  const kicker = {
    es: 'Nuestra cocina',
    cat: '',
    it: 'Our Cuisine'
  }
  // [text, highlighted end]
  const name = {
    es: ['Un viaje por Asia en', 'cada bocado'],
    cat: ['', ''],
    it: ['', '']
  }
  const menus = 'Ver menús'

  return (
    <section className='section4'>
      <div className='section-header' data-reveal='up'>
        <p className='kicker'>{kicker[language]}</p>
        <h2 className='heading'>{name[language][0]} <em>{name[language][1]}</em></h2>
      </div>
      <div className='container'>
        {cocina.map(({ name, description, photo }, index) => (
          <article key={index} className='cocina' data-reveal='up' style={revealDelay(index)}>
            <img src={require(`../images/${photo}.webp`)} alt={name[language]} loading='lazy' />
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
