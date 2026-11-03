import React, { useState } from 'react'
import { dishesByNumber } from '../pedidos/takeawayMenu'
import { formatPrice } from '../pedidos/deliveryRules'
import './sections.css'

// numbers: the ramen of takeaway-menu.json made with each broth
const broths = [
    { id: 'tonkotsu', name: 'Tonkotsu', kanji: '豚骨', text: 'Caldo cremoso de hueso de cerdo, cocinado durante horas. El clásico de Fukuoka.', numbers: [1, 2, 3, 4, 5] },
    { id: 'tori', name: 'Tori', kanji: '鶏白湯', text: 'Caldo de gallina de corral, más ligero y sedoso, con brocheta de pollo.', numbers: [6, 7] },
    { id: 'vegetal', name: 'Vegetal', kanji: '野菜', text: 'Caldo de verduras con tofu frito y shiitake. 100 % vegano.', numbers: [10] },
    { id: 'sin-caldo', name: 'Sin caldo', kanji: '汁なし', text: 'Fideos para mojar en un caldo intenso o para mezclar con salsa.', numbers: [8, 9] },
]

// Pick a broth to see its ramen: helps a first-timer choose among the 10 of the menu
const RamenGuide = () => {
    const [brothId, setBrothId] = useState(broths[0].id)
    const broth = broths.find(({ id }) => id === brothId)

    return (
        <section className='ramen-guide'>
            <div className='section-header' data-reveal='up'>
                <p className='kicker'>Primera vez en IOYI</p>
                <h2 className='heading'>Elige tu <em>caldo</em></h2>
                <p className='lead'>Todo ramen empieza por el caldo. Elige el tuyo y te enseñamos los boles que salen de él.</p>
            </div>
            <div className='ramen-guide-broths' role='tablist' data-reveal='up'>
                {broths.map(({ id, name, kanji }) => (
                    <button key={id} type='button' role='tab' aria-selected={id === brothId} className={id === brothId ? 'is-selected' : undefined} onClick={() => setBrothId(id)}>
                        <span className='ramen-guide-kanji' aria-hidden='true'>{kanji}</span>
                        <span>{name}</span>
                    </button>
                ))}
            </div>
            <p key={`${brothId}-text`} className='ramen-guide-text'>{broth.text}</p>
            <div key={brothId} className='ramen-guide-bowls'>
                {broth.numbers.map((number, index) => {
                    const { name, description, priceInCents, photoUrl, isVegan, isSpicy } = dishesByNumber[number]
                    return (
                        <article key={number} className='ramen-guide-bowl' style={{ animationDelay: `${index * 0.08}s` }}>
                            <img src={photoUrl} alt={name.es} loading='lazy' />
                            <div className='ramen-guide-bowl-body'>
                                <h3>{name.es}</h3>
                                <p>{description}</p>
                                <div className='ramen-guide-bowl-footer'>
                                    <span className='ramen-guide-price'>{formatPrice(priceInCents)}</span>
                                    {isVegan && <span className='ramen-guide-tag is-vegan'>Vegano</span>}
                                    {isSpicy && <span className='ramen-guide-tag is-spicy'>Picante</span>}
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default RamenGuide
