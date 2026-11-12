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

// A printed menu card: pick a kind of sushi on the left, its dishes with prices in the middle, the hovered one's photo on the right
const SushiGuide = () => {
    const [kindId, setKindId] = useState(kinds[0].id)
    const [hoveredNumber, setHoveredNumber] = useState(null)
    const kind = kinds.find(({ id }) => id === kindId)
    const shownNumber = kind.numbers.includes(hoveredNumber) ? hoveredNumber : kind.numbers[0]
    const shownDish = dishesByNumber[shownNumber]

    return (
        <section className='sushi-guide'>
            <div className='section-header' data-reveal='up'>
                <p className='kicker'>¿Por dónde empiezo?</p>
                <h2 className='heading'>Elige tu <em>sushi</em></h2>
                <p className='lead'>Uramaki, nigiri, temaki… Elige un tipo y te enseñamos algunos de los que más se piden.</p>
            </div>
            <div className='sushi-guide-card' data-reveal='up'>
                <div className='sushi-guide-kinds' role='tablist' aria-orientation='vertical'>
                    {kinds.map(({ id, name, kanji }) => (
                        <button key={id} type='button' role='tab' aria-selected={id === kindId} className={id === kindId ? 'is-selected' : undefined} onClick={() => setKindId(id)}>
                            <span className='sushi-guide-kanji' aria-hidden='true'>{kanji}</span>
                            <span>{name}</span>
                        </button>
                    ))}
                </div>
                <div key={kindId} className='sushi-guide-list'>
                    <h3 className='sushi-guide-title'>{kind.name}</h3>
                    <p className='sushi-guide-text'>{kind.text}</p>
                    <ul>
                        {kind.numbers.map((number, index) => {
                            const { name, description, priceInCents, isVegan, isSpicy } = dishesByNumber[number]
                            return (
                                <li
                                    key={number}
                                    className={number === shownNumber ? 'is-shown' : undefined}
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                    onMouseEnter={() => setHoveredNumber(number)}
                                >
                                    <div className='sushi-guide-row'>
                                        <h4>{name.es}</h4>
                                        <span className='sushi-guide-leader' />
                                        <span className='sushi-guide-price'>{formatPrice(priceInCents)}</span>
                                    </div>
                                    <p>
                                        {description}
                                        {isVegan && <span className='sushi-guide-tag is-vegan'>Vegano</span>}
                                        {isSpicy && <span className='sushi-guide-tag is-spicy'>Picante</span>}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <figure className='sushi-guide-photo'>
                    <img key={shownNumber} src={shownDish.photoUrl} alt={shownDish.name.es} loading='lazy' />
                </figure>
            </div>
        </section>
    )
}

export default SushiGuide
