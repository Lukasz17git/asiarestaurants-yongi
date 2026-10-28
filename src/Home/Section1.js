import React from 'react'
import CountUp from '../_new/reveal/CountUp'
import { revealDelay } from '../_new/reveal/useReveal'

const Section1 = () => {
  const language = 'es'
  const question = {
    es: 'Quiénes somos',
    cat: '',
    en: 'Who are we?'
  }
  // [text, highlighted end]
  const title = {
    es: ['Más de 200 platos y un solo problema:', 'elegir'],
    cat: ['', ''],
    en: ['', '']
  }
  const description1 = {
    es: 'En Asia Oriental Taste cocinamos las recetas más auténticas de Japón y China con producto fresco cada día: sushi cortado al momento, wok al fuego vivo y dim sum al vapor que se deshace en la boca.',
    cat: '',
    it: 'I ristoranti ASIA offrono ai propri ospiti ricette tradizionali della cucina giapponese e tanto altro.',
    en: ''
  }
  const description2 = {
    es: 'Elegante para una cena especial, divertido para venir con amigos y perfecto para toda la familia. Siéntate, pide otra ronda y déjate sorprender.',
    cat: '',
    it: 'Specialità fusion, dalla cultura Cinese alla cultura Giapponese.',
    en: ''
  }
  const stats = [
    { number: <CountUp to={200} prefix='+' />, text: { es: 'platos en carta' } },
    { number: <CountUp to={4} />, text: { es: 'restaurantes Asia' } },
    { number: '2006', text: { es: 'cocinando desde' } },
  ]

  return (
    <section className='section1'>
      <div className='collage' data-reveal='left'>
        <img className='collage-main' src={require('../images/home/home1.webp')} alt='Mesa con platos de cocina china para compartir' loading='lazy' />
        <img className='collage-top' src={require('../images/home/home3.webp')} alt='Uramaki de ternera' loading='lazy' />
        <img className='collage-bottom' src={require('../images/home/home12.webp')} alt='Dim sum al vapor' loading='lazy' />
        <div className='collage-badge'><span>+200</span>platos</div>
      </div>
      <div className='intro' data-reveal='right'>
        <p className='kicker'>{question[language]}</p>
        <h2 className='heading'>{title[language][0]} <em>{title[language][1]}</em></h2>
        <p className='lead'>{description1[language]}</p>
        <p className='lead'>{description2[language]}</p>
        <div className='stats'>
          {stats.map(({ number, text }, index) => (
            <div key={index} className='stat' data-reveal='up' style={revealDelay(index, 0.15)}>
              <div className='stat-number'>{number}</div>
              <div className='stat-text'>{text[language]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section1
