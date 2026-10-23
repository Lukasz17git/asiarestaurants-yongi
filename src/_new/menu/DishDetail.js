import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../pedidos/deliveryRules'

const otherLanguages = [
    { code: 'en', label: 'English' },
    { code: 'cat', label: 'Català' },
    { code: 'it', label: 'Italiano' },
    { code: 'zh', label: '中文' },
]

// 'ONIGIRI SAKE' -> 'Onigiri sake'; names already in mixed case and '鮭魚飯糰' stay as they are
const toSentenceCase = (text) => (text === text.toUpperCase() && text !== text.toLowerCase()
    ? text.charAt(0) + text.slice(1).toLowerCase()
    : text)

// Only the names that say something new: missing ones and copies of the Spanish name are skipped
const getOtherNames = (name) => otherLanguages
    .map(({ code, label }) => ({ label, text: toSentenceCase(name[code]?.trim() ?? '') }))
    .filter(({ text }) => text && text.toLowerCase() !== name.es.trim().toLowerCase())

const DishDetail = ({ dish, sectionName, quantity, onChangeQuantity, onClose }) => {
    const closeRef = useRef(null)
    const otherNames = getOtherNames(dish.name)

    useEffect(() => {
        closeRef.current.focus()
        const closeOnEscape = (event) => event.key === 'Escape' && onClose()
        document.addEventListener('keydown', closeOnEscape)
        document.body.classList.add('carta-detail-open')
        return () => {
            document.removeEventListener('keydown', closeOnEscape)
            document.body.classList.remove('carta-detail-open')
        }
    }, [onClose])

    return (
        <div className='carta-detail-backdrop' onClick={onClose}>
            <div className='carta-detail' role='dialog' aria-modal='true' aria-labelledby='carta-detail-title' onClick={(event) => event.stopPropagation()}>
                <button type='button' className='carta-detail-close' ref={closeRef} onClick={onClose} aria-label='Cerrar'>×</button>
                <div className='carta-detail-photo'>
                    {dish.photoUrl
                        ? <img src={dish.photoUrl} alt={dish.name.es} />
                        : <span className='carta-dish-placeholder' aria-hidden='true'>{dish.number}</span>}
                </div>
                <div className='carta-detail-body'>
                    <p className='carta-detail-section'>{sectionName} · Nº {dish.number}</p>
                    <h2 id='carta-detail-title'>{dish.name.es}</h2>
                    {dish.description && <p className='carta-detail-description'>{dish.description}</p>}
                    {(dish.isVegan || dish.isSpicy) && (
                        <p className='carta-detail-tags'>
                            {dish.isVegan && <span className='carta-tag vegan'>Vegano</span>}
                            {dish.isSpicy && <span className='carta-tag spicy'>Picante</span>}
                        </p>
                    )}
                    {!!otherNames.length && (
                        <dl className='carta-detail-names'>
                            {otherNames.map(({ label, text }) => (
                                <div key={label}><dt>{label}</dt><dd>{text}</dd></div>
                            ))}
                        </dl>
                    )}
                    <div className='carta-detail-footer'>
                        <span className='carta-detail-price'>{formatPrice(dish.priceInCents)}</span>
                        {quantity
                            ? (
                                <div className='carta-stepper'>
                                    <button type='button' onClick={() => onChangeQuantity(-1)} aria-label={`Quitar uno de ${dish.name.es}`}>−</button>
                                    <span aria-live='polite'>{quantity}</span>
                                    <button type='button' onClick={() => onChangeQuantity(1)} aria-label={`Añadir otro de ${dish.name.es}`}>+</button>
                                </div>
                            )
                            : <button type='button' className='carta-button' onClick={() => onChangeQuantity(1)}>Añadir a mi pedido</button>}
                    </div>
                    {quantity > 0 && <Link to='/pedidos' className='carta-detail-link'>Ver mi pedido y enviarlo por WhatsApp →</Link>}
                </div>
            </div>
        </div>
    )
}

export default DishDetail
