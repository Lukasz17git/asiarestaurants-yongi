import React from 'react'
import cocina from './cocinaData'
import { Link } from 'react-router-dom'
import gold from '../generateGold'

const Section4 = () => {
  const language = 'es'
  const name = {
    es: 'Nuestra Cocina',
    cat: '',
    it: 'Our Cuisine'
  }
  const menus = 'Ver menús'
  return (
    <div className='section4'>
      <div className='fan' />
      <div className='name '>{name[language]}</div>
      <div className='container'>
        {cocina.map(({ name, description }, index) => (
          <div key={index} className={'cocina cocina' + index}>
            <div className='title'>{gold(name[language])}</div>
            <div className='description'>{description[language]}</div>
          </div>
        ))}
        <img alt='restaurant' />
      </div>
      <div className='button'>
        <Link to='/menu'>
          <div className='button-bg'>
            {menus}
          </div>
        </Link>
      </div>
      <div className='fan2' />
    </div>
  )
}

export default Section4