import React from 'react'
import CountUp from '../_new/reveal/CountUp'
import { revealDelay } from '../_new/reveal/useReveal'

const photos = [
  { photo: 'home1', alt: 'Mesa con platos de cocina china para compartir', caption: 'Para compartir' },
  { photo: 'home3', alt: 'Uramaki de ternera', caption: 'Uramaki de ternera' },
  { photo: 'home12', alt: 'Dim sum al vapor', caption: 'Dim sum al vapor' },
]

// Laid out like a magazine article: number, big quote, two text columns, a photo strip and the figures
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
    { number: '4,2', text: { es: 'de media en más de 500 reseñas' }, stars: true },
    { number: <CountUp to={200} prefix='+' />, text: { es: 'platos en carta' } },
    { number: '2006', text: { es: 'cocinando desde' } },
  ]

  return (
    <section className='section1'>
      <header className='article-header' data-reveal='up'>
        <span className='article-number'>01</span>
        <p className='kicker'>{question[language]}</p>
      </header>
      <h2 className='heading article-quote' data-reveal='up'>{title[language][0]} <em>{title[language][1]}</em></h2>
      <div className='article-columns' data-reveal='up'>
        <p className='lead'>{description1[language]}</p>
        <p className='lead'>{description2[language]}</p>
      </div>
      <div className='article-photos'>
        {photos.map(({ photo, alt, caption }, index) => (
          <figure key={photo} data-reveal='up' style={revealDelay(index, 0.12)}>
            <img src={require(`../images/home/${photo}.webp`)} alt={alt} loading='lazy' />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </div>
      <ul className='article-stats'>
        {stats.map(({ number, text, stars }, index) => (
          <li key={index} data-reveal='up' style={revealDelay(index, 0.15)}>
            <div className='stat-number'>{number}</div>
            {stars && <div className='stat-stars' aria-hidden='true'>★★★★☆</div>}
            <div className='stat-text'>{text[language]}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Section1
