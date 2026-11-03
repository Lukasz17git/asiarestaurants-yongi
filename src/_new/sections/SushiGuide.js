import React, { useState } from 'react'
import { dishesByNumber } from '../pedidos/takeawayMenu'
import { formatPrice } from '../pedidos/deliveryRules'
import './sections.css'

// numbers: dishes of takeaway-menu.json, all with a photo
const kinds = [
    { id: 'uramaki', name: 'Uramaki', kanji: '裏巻', text: 'El roll con el arroz por fuera: el favorito para empezar y para compartir.', numbers: [117, 124, 128, 138] },
    { id: 'nigiri', name: 'Nigiri', kanji: '握り', text: 'Una bola de arroz con su loncha de pescado encima. Pruébalos también flambeados.', numbers: [158, 162, 161, 168] },
    { id: 'venere', name: 'Venere', kanji: '黒米', text: 'Rolls de arroz negro Venere, con burrata, pistacho y langostino.', numbers: [153, 154, 157, 156] },
    { id: 'temaki', name: 'Temaki', kanji: '手巻', text: 'Un cono de alga relleno para comer con la mano.', numbers: [180, 181, 183, 186] },
    { id: 'crispy', name: 'Crispy', kanji: 'クリスピー', text: 'Lo crujiente: hojas fritas, alga nori y tacos con tartar de salmón o atún.', numbers: [108, 109, 111, 115] },
]

// Pick a kind of sushi to see some of its dishes: helps choose among the 200 of the menu
const SushiGuide = () => {
    const [kindId, setKindId] = useState(kinds[0].id)
    const kind = kinds.find(({ id }) => id === kindId)

    return (
        <section className='sushi-guide'>
            <div className='section-header' data-reveal='up'>
                <p className='kicker'>¿Por dónde empiezo?</p>
                <h2 className='heading'>Elige tu <em>sushi</em></h2>
                <p className='lead'>Uramaki, nigiri, temaki… Elige un tipo y te enseñamos algunos de los que más se piden.</p>
            </div>
            <div className='sushi-guide-kinds' role='tablist' data-reveal='up'>
                {kinds.map(({ id, name, kanji }) => (
                    <button key={id} type='button' role='tab' aria-selected={id === kindId} className={id === kindId ? 'is-selected' : undefined} onClick={() => setKindId(id)}>
                        <span className='sushi-guide-kanji' aria-hidden='true'>{kanji}</span>
                        <span>{name}</span>
                    </button>
                ))}
            </div>
            <p key={`${kindId}-text`} className='sushi-guide-text'>{kind.text}</p>
            <div key={kindId} className='sushi-guide-dishes'>
                {kind.numbers.map((number, index) => {
                    const { name, description, priceInCents, photoUrl, isVegan, isSpicy } = dishesByNumber[number]
                    return (
                        <article key={number} className='sushi-guide-dish' style={{ animationDelay: `${index * 0.08}s` }}>
                            <img src={photoUrl} alt={name.es} loading='lazy' />
                            <div className='sushi-guide-dish-body'>
                                <h3>{name.es}</h3>
                                <p>{description}</p>
                                <div className='sushi-guide-dish-footer'>
                                    <span className='sushi-guide-price'>{formatPrice(priceInCents)}</span>
                                    {isVegan && <span className='sushi-guide-tag is-vegan'>Vegano</span>}
                                    {isSpicy && <span className='sushi-guide-tag is-spicy'>Picante</span>}
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default SushiGuide
