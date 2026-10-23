import React from 'react'
import { formatPrice } from '../pedidos/deliveryRules'

// The title's button covers the whole card (::after), so the card opens the dish without a button around an <h3>
const MenuDishCard = ({ dish, quantity, onOpen }) => (
    <article className={dish.photoUrl ? 'carta-dish' : 'carta-dish no-photo'}>
        <div className='carta-dish-photo'>
            {dish.photoUrl
                ? <img src={dish.photoUrl} alt='' loading='lazy' />
                : <span className='carta-dish-placeholder' aria-hidden='true'>{dish.number}</span>}
            <span className='carta-dish-number'>{dish.number}</span>
            <span className='carta-dish-tags'>
                {dish.isVegan && <span className='carta-tag vegan'>Vegano</span>}
                {dish.isSpicy && <span className='carta-tag spicy'>Picante</span>}
            </span>
            {quantity > 0 && <span className='carta-dish-in-cart'>{quantity} en tu pedido</span>}
        </div>
        <div className='carta-dish-texts'>
            <h3><button type='button' className='carta-dish-open' onClick={onOpen}>{dish.name.es}</button></h3>
            {dish.description && <p>{dish.description}</p>}
            <span className='carta-dish-price'>{formatPrice(dish.priceInCents)}</span>
        </div>
    </article>
)

export default MenuDishCard
