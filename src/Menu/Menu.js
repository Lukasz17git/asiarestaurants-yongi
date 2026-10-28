import React from 'react'
import { revealDelay } from '../_new/reveal/useReveal'

const Menu = ({ menu, index }) => {
  const language = 'es'
  const { name, description, button, time, pdf, price, price2, image } = menu
  return (
    <article className='menu-card' data-reveal='up' style={revealDelay(index, 0.15)}>
      <div className='menu-photo'>
        <img src={require(`../images/${image}.webp`)} alt={name[language]} loading='lazy' />
        {time && <span className='menu-time'>{time[language]}</span>}
      </div>
      <div className='menu-body'>
        <h3 className='menu-title'>{name[language]}</h3>
        {price && <div className='menu-price'>{price}</div>}
        {price2 && <div className='menu-price2'>{price2}</div>}
        <p className='menu-description'>{description[language]}</p>
        {button && <a className='cta cta-red' href={pdf} target='_blank' rel='noreferrer'>{button[language]}</a>}
      </div>
    </article>
  )
}

export default Menu
