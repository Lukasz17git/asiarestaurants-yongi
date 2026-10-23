import React from 'react'
import examples from './examplesData'
import gold from '../generateGold'

const Section3 = () => {
  const language = 'es'
  const name = {
    es: 'Nuestros Platos más Populares',
    cat: '',
    it: ''
  }


  return (
    <div className='section3'>
      <div className='titles-container'>
        <div className='name'>{name[language]}</div>
      </div>
      <div className='dishes-container'>
        {
          examples.map(({ name, photo, description }) => (
            <div key={name} className='dish'>
              <div className='dish-title'>{gold(name)}</div>
              <img className={photo} alt='restaurant' />
              <div className='description font3 grey'>{description[language]}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Section3