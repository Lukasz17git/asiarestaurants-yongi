import React from 'react'
import { Link } from 'react-router-dom'
import examples from './examplesData'
import gold from '../generateGold'
import { revealDelay } from '../_new/reveal/useReveal'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const Section3 = () => {
  const language = 'es'
  const kicker = {
    es: 'Para compartir',
    cat: '',
    it: ''
  }
  // [text, highlighted end]
  const name = {
    es: ['Más allá del', 'ramen'],
    cat: ['', ''],
    it: ['', '']
  }
  const description = {
    es: 'Donburis, baos y entrantes japoneses para abrir boca o pedir otra ronda mientras llega tu bol.',
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
              <img src={ioyiPhoto(`dishes/${photo}`)} alt={name} loading='lazy' />
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
