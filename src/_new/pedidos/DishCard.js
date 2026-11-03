import React from 'react'
import { ioyiPhoto } from '../images/ioyi/photos'
import { formatPrice } from './deliveryRules'

const sealUrl = ioyiPhoto('seal')

export const QuantityControl = ({ quantity, name, onChange, size }) => (
    <div className={`pedidos-quantity ${size ?? ''}`}>
        <button type='button' onClick={() => onChange(-1)} aria-label={`Quitar uno de ${name}`}>−</button>
        <span aria-live='polite'>{quantity}</span>
        <button type='button' onClick={() => onChange(1)} aria-label={`Añadir otro de ${name}`}>+</button>
    </div>
)

const DishCard = ({ dish, quantity, onChange }) => (
    <article className={quantity ? 'pedidos-dish in-cart' : 'pedidos-dish'}>
        <span className='pedidos-dish-number'>{dish.number}</span>
        <div className='pedidos-dish-media'>
            {dish.photoUrl
                ? <img src={dish.photoUrl} alt={dish.name.es} loading='lazy' />
                : <div className='pedidos-dish-placeholder' aria-hidden='true'><img src={sealUrl} alt='' /></div>}
        </div>
        <div className='pedidos-dish-body'>
            <h3>
                {dish.name.es}
                {dish.isVegan && <span className='pedidos-tag vegan'>Vegano</span>}
                {dish.isSpicy && <span className='pedidos-tag spicy'>Picante</span>}
            </h3>
            {dish.description && <p className='pedidos-dish-description'>{dish.description}</p>}
            <div className='pedidos-dish-footer'>
                <span className='pedidos-dish-price'>{formatPrice(dish.priceInCents)}</span>
                {quantity
                    ? <QuantityControl quantity={quantity} name={dish.name.es} onChange={onChange} />
                    : <button type='button' className='pedidos-add' onClick={() => onChange(1)} aria-label={`Añadir ${dish.name.es}`}>+</button>}
            </div>
        </div>
    </article>
)

export default DishCard
