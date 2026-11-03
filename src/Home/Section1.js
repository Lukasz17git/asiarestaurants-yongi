import React from 'react'
import CountUp from '../_new/reveal/CountUp'
import { revealDelay } from '../_new/reveal/useReveal'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const Section1 = () => {
  const language = 'es'
  const question = {
    es: 'Nuestra casa',
    cat: '',
    en: 'Our place'
  }
  // [text, highlighted end]
  const title = {
    es: ['Una barra de ramen de Japón en', 'Vilafranca'],
    cat: ['', ''],
    en: ['', '']
  }
  const description1 = {
    es: 'IOYI es un local pequeño, de unas 20 plazas, pensado como los ramen-ya de barrio de Japón: madera, farolillos y el vapor de los caldos saliendo de la cocina.',
    cat: '',
    en: ''
  }
  const description2 = {
    es: 'Cocinamos los caldos durante horas, cocemos los fideos al punto y montamos cada bol al momento. ¿Es tu primera vez? Pregúntanos: te explicamos cada ramen y lo adaptamos si lo necesitas.',
    cat: '',
    en: ''
  }
  const stats = [
    { number: '4,7', text: { es: 'de media en más de 360 reseñas' } },
    { number: <CountUp to={20} />, text: { es: 'plazas, como en Japón' } },
    { number: <CountUp to={10} />, text: { es: 'ramen distintos en carta' } },
  ]

  return (
    <section className='section1'>
      <div className='collage' data-reveal='left'>
        <img className='collage-main' src={ioyiPhoto('place/ioyi-cover')} alt='Dos ramen de IOYI en una mesa de madera' loading='lazy' />
        <img className='collage-top' src={ioyiPhoto('place/chef')} alt='Cocinero preparando ramen' loading='lazy' />
        <img className='collage-bottom' src={ioyiPhoto('place/noodle-lift')} alt='Fideos de ramen recién servidos' loading='lazy' />
        <div className='collage-badge'><span>20</span>plazas</div>
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
