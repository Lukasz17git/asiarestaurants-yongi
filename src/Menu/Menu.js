import React from 'react'
import { Link } from 'react-router-dom'
import { revealDelay } from '../_new/reveal/useReveal'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const Menu = ({ menu, index }) => {
  const language = 'es'
  const { name, description, button, time, to, price, price2, image } = menu
  return (
    <article className='menu-card' data-reveal='up' style={revealDelay(index, 0.15)}>
      <div className='menu-photo'>
        <img src={ioyiPhoto(image)} alt={name[language]} loading='lazy' />
        {time && <span className='menu-time'>{time[language]}</span>}
      </div>
      <div className='menu-body'>
        <h3 className='menu-title'>{name[language]}</h3>
        {price && <div className='menu-price'>{price}</div>}
        {price2 && <div className='menu-price2'>{price2}</div>}
        <p className='menu-description'>{description[language]}</p>
        {button && (to.startsWith('#')
          ? <a className='cta cta-red' href={to}>{button[language]}</a>
          : <Link className='cta cta-red' to={to}>{button[language]}</Link>)}
      </div>
    </article>
  )
}

export default Menu
