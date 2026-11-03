import React from 'react'
import { formatPrice } from '../_new/pedidos/deliveryRules'

const Dish = ({ dish, index }) => {
  const { number, name, description, priceInCents, photoUrl, isVegan, isSpicy } = dish
  const maxDelayedDishesNumber = 12
  const animationDelay = `${Math.min(index, maxDelayedDishesNumber) * 0.05}s`

  return (
    <article className='dish-container' style={{ animationDelay }}>
      <div className='photo'>
        {photoUrl
          ? <img alt={name.es} src={photoUrl} loading='lazy' />
          : <span className='photo-placeholder' aria-hidden='true'>{number}</span>}
      </div>
      <div className='dish-body'>
        <h3 className='name'>{name.es}</h3>
        {description && <p className='dish-description'>{description}</p>}
        <div className='dish-footer'>
          <span className='dish-price'>{formatPrice(priceInCents)}</span>
          {isVegan && <span className='dish-tag is-vegan'>Vegano</span>}
          {isSpicy && <span className='dish-tag is-spicy'>Picante</span>}
        </div>
      </div>
    </article>
  )
}

export default Dish
