import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer'
import '../css/Menu.css'
import Menu from './Menu'
import menus from './MenusData'
import Dish from './Dish'
import Marquee from '../_new/sections/Marquee'
import FinalCall from '../_new/sections/FinalCall'
import { useReveal } from '../_new/reveal/useReveal'
import { hoursText, phoneText, phoneUrl } from '../_new/sections/reservation'
import { menuSections } from '../_new/pedidos/takeawayMenu'
import { formatPrice } from '../_new/pedidos/deliveryRules'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const drinksSectionId = 'bebidas'
const dishSections = menuSections.filter(({ id }) => id !== drinksSectionId)
const drinks = menuSections.find(({ id }) => id === drinksSectionId).dishes
// On phones the line breaks only at '·'
const [hoursDays, hoursTimes] = hoursText.split(' · ')

// x/y: where each part sits on the Akamaru photo, in %
const bowlParts = [
  { name: 'Alga nori', text: 'Crujiente al principio, se ablanda con el caldo.', x: 80, y: 26 },
  { name: 'Cebolla tierna', text: 'Fresca, para cortar la grasa del caldo.', x: 50, y: 40 },
  { name: 'Setas negras', text: 'Kikurage: textura crujiente y sabor suave.', x: 24, y: 44 },
  { name: 'Huevo marinado', text: 'Ajitama con la yema melosa, marinado en soja.', x: 36, y: 64 },
  { name: 'Chashu', text: 'Panceta de cerdo enrollada y estofada a fuego lento.', x: 66, y: 66 },
  { name: 'Caldo tonkotsu', text: 'Hueso de cerdo cocinado durante horas, con aceite de ajo.', x: 30, y: 86 },
]

// Desserts aren't in takeaway-menu.json; the reviews name these two
const desserts = [
  { name: 'Mochi de Oreo', text: 'El mochi japonés, con galleta Oreo.' },
  { name: 'Leche de coco con tapioca', text: 'Un final ligero después del ramen.' },
]

const Menus = () => {
  const language = 'es'
  const pageRef = useRef(null)
  const [sectionId, setSectionId] = useState(dishSections[0].id)
  useReveal(pageRef)

  const visibleSection = dishSections.find(({ id }) => id === sectionId)
  const { day, carta, pedidos } = menus

  const heroText = {
    es: 'Diez ramen de caldo lento, donburis, baos y entrantes japoneses, hechos al momento en nuestra barra de Vilafranca. Pide tu bol, comparte unas gyozas y deja hueco para el postre.',
    cat: '',
    it: ''
  }
  const menusWords = ['Menú del día', 'Ramen', 'Donburi', 'Gyozas', 'Baos', 'Onigiri', 'Para llevar', 'A domicilio']

  const anatomy = {
    es: ['Anatomía de', 'un Akamaru'],
    cat: ['', ''],
    it: ['', '']
  }
  const anatomyDescription = {
    es: 'Nuestro bol más aromático: caldo cremoso de cerdo con aceite de ajo. Cada ingrediente tiene su papel; así se come mejor.',
    cat: '',
    it: ''
  }
  const takeAway = {
    es: ['Tu ramen,', 'donde quieras'],
    cat: ['', ''],
    it: ['', ''],
    en: ['', '']
  }
  const takeAwayDescription = {
    es: 'Toda la carta para llevar: elige tus platos, envíanos el pedido por WhatsApp y pásate a recogerlo o te lo llevamos a casa.',
    cat: '',
    it: ''
  }

  return (
    <div className='main-menu' ref={pageRef}>
      <header className='menus-hero'>
        <img className='menus-hero-bg' src={ioyiPhoto('place/ramen-bar')} alt='' />
        <div className='menus-hero-content'>
          <p className='kicker'>La carta</p>
          <h1 className='heading'>Ramen, donburis y <em>entrantes japoneses</em></h1>
          <p className='lead'>{heroText[language]}</p>
          <p className='menus-hero-hours'><span>{hoursDays}</span> · <span>{hoursTimes}</span></p>
        </div>
      </header>

      <Marquee words={menusWords} />

      <section id='menus' className='menus-container'>
        <div className='section-header' data-reveal='up'>
          <p className='kicker'>Menú y carta</p>
          <h2 className='heading'>Elige tu <em>momento</em></h2>
          <p className='lead'>Menú del día entre semana, la carta a mediodía y por la noche, o tu ramen en casa.</p>
        </div>
        <div className='wrapper'>
          {[day, carta, pedidos].map((menu, index) => <Menu key={menu.to} menu={menu} index={index} />)}
        </div>
      </section>

      <section id='bol' className='anatomy'>
        <div className='container'>
          <div className='left' data-reveal='left'>
            <p className='kicker'>Cómo es un ramen de IOYI</p>
            <h2 className='heading'>{anatomy[language][0]} <em>{anatomy[language][1]}</em></h2>
            <p className='lead'>{anatomyDescription[language]}</p>
            <ol className='anatomy-parts'>
              {bowlParts.map(({ name, text }) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className='anatomy-bowl' data-reveal='zoom'>
            <img src={ioyiPhoto('dishes/akamaru')} alt='Ramen Akamaru de IOYI visto desde arriba' loading='lazy' />
            {bowlParts.map(({ name, x, y }, index) => (
              <span key={name} className='anatomy-dot' style={{ left: `${x}%`, top: `${y}%` }} title={name}>{index + 1}</span>
            ))}
          </div>
        </div>
      </section>

      <section id='platos' className='meals'>
        <div className='section-header' data-reveal='up'>
          <p className='kicker'>Nuestros platos</p>
          <h2 className='heading'>Elige tu <em>antojo</em></h2>
        </div>
        <div className='meals-tabs' data-reveal='up'>
          {dishSections.map((section) => (
            <button key={section.id} type='button' className={section.id === sectionId ? 'is-selected' : undefined} onClick={() => setSectionId(section.id)}>
              <b aria-hidden='true'>{section.kanji}</b>
              <span>{section.name}</span>
            </button>
          ))}
        </div>
        {visibleSection.note && <p className='meals-note'>{visibleSection.note}</p>}
        <div key={sectionId} className='meals-grid'>
          {visibleSection.dishes.map((dish, index) => <Dish key={dish.number} dish={dish} index={index} />)}
        </div>
      </section>

      <section id='llevar' className='takeaway'>
        <div className='container'>
          <img data-reveal='left' src={ioyiPhoto('dishes/katsu-sando')} alt='Katsu Sando de IOYI' loading='lazy' />
          <div className='right' data-reveal='right'>
            <p className='kicker'>Para llevar</p>
            <h2 className='heading'>{takeAway[language][0]} <em>{takeAway[language][1]}</em></h2>
            <p className='lead'>{takeAwayDescription[language]}</p>
            <div className='cta-buttons'>
              <Link className='cta cta-red' to='/pedidos'>Pedir online</Link>
              <a className='cta cta-gold' href={phoneUrl}>Llamar al {phoneText.replace('+34 ', '')}</a>
            </div>
          </div>
        </div>
      </section>

      <section id='acompanar' className='cartas'>
        <div className='section-header' data-reveal='up'>
          <p className='kicker'>Para acompañar</p>
          <h2 className='heading'>El broche <em>perfecto</em></h2>
        </div>
        <div className='wrapper'>
          <div className='carta-title' data-reveal='up'><b aria-hidden='true'>甘味</b><h3>Postres</h3></div>
          <ul className='carta-list' data-reveal='up'>
            {desserts.map(({ name, text }) => (
              <li key={name}>
                <span className='carta-item-name'>{name}</span>
                <span className='carta-item-text'>{text}</span>
              </li>
            ))}
          </ul>
          <div className='carta-title' data-reveal='up'><b aria-hidden='true'>飲物</b><h3>Bebidas</h3></div>
          <ul className='carta-list is-prices' data-reveal='up' style={{ '--rows': Math.ceil(drinks.length / 2) }}>
            {drinks.map(({ number, name, priceInCents }) => (
              <li key={number}>
                <span className='carta-item-name'>{name.es}</span>
                <span className='carta-item-price'>{formatPrice(priceInCents)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCall />
      <Footer />
    </div>
  )
}

export default Menus
