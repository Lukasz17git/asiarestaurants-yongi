import React from 'react'
import { Link } from 'react-router-dom'
import examples from './examplesData'
import gold from '../generateGold'
import { revealDelay } from '../_new/reveal/useReveal'

const Section3 = () => {
  const language = 'es'
  const kicker = {
    es: 'Los más pedidos',
    cat: '',
    it: ''
  }
  // [text, highlighted end]
  const name = {
    es: ['Los favoritos que todo el mundo', 'repite'],
    cat: ['', ''],
    it: ['', '']
  }
  const description = {
    es: 'Pídelos nada más sentarte: son nuestros platos más populares y los que todo el mundo vuelve a pedir.',
    cat: '',
    it: ''
  }

  return (
    <section className='section3'>
      <div className='section-header' data-reveal='up'>
        <p className='kicker'>{kicker[language]}</p>
        <h2 className='heading'>{name[language][0]} <em>{name[language][1]}</em></h2>
        <p className='lead'>{description[language]}</p>
      </div>
      <div className='dishes-container'>
        {examples.map(({ name, photo, tag, description }, index) => (
          <article key={name} className='dish' data-reveal='up' style={revealDelay(index)}>
            <div className='dish-photo'>
              <img className={photo} alt={name} />
              <span className='dish-tag'>{tag[language]}</span>
              <span className='dish-number'>0{index + 1}</span>
            </div>
            <h3 className='dish-title'>{gold(name)}</h3>
            <p className='description'>{description[language]}</p>
          </article>
        ))}
      </div>
      <div className='cta-buttons' data-reveal='up'>
        <Link className='cta cta-red' to='/menu'>Ver toda la carta</Link>
      </div>
    </section>
  )
}

export default Section3
