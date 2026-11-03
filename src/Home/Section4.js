import React from 'react'
import cocina from './cocinaData'
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
  const lead = {
    es: 'Vegano, sin gluten, con picante o sin caldo: en IOYI cada uno encuentra su bol. ¿Alergias o dudas? Pregúntanos y te lo adaptamos.',
    cat: '',
    it: ''
  }

  return (
    <section className='section4'>
      <div className='section-header' data-reveal='up'>
        <p className='kicker'>{kicker[language]}</p>
        <h2 className='heading'>{name[language][0]} <em>{name[language][1]}</em></h2>
        <p className='lead'>{lead[language]}</p>
      </div>
      <div className='container'>
        {cocina.map(({ name, kanji, photo, description }, index) => (
          <article key={index} className='cocina' data-reveal='up' style={revealDelay(index)}>
            <img src={ioyiPhoto(photo)} alt={name[language]} loading='lazy' />
            <div className='cocina-text'>
              <span className='cocina-kanji' aria-hidden='true'>{kanji}</span>
              <h3 className='title'>{name[language]}</h3>
              <p className='description'>{description[language]}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Section4
