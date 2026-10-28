import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer'
import '../css/Menu.css'
import Menu from './Menu'
import menus from './MenusData'
import meals from './MealsData'
import Dish from './Dish'
import Marquee from '../_new/sections/Marquee'
import FinalCall from '../_new/sections/FinalCall'
import { revealDelay, useReveal } from '../_new/reveal/useReveal'
import { reservationWhatsappUrl } from '../_new/sections/reservation'

// The category with most dishes; each one fills two rows at most
const defaultCategoryName = 'Uramaki'

const getVisibleMeals = (categoryName, language) => meals.find((category) => category.name[language] === categoryName).meals

// The page's own base href ('/') would turn '#menus' into the Home page, so the shortcuts scroll by hand
const scrollToSection = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })

const Menus = () => {
  const language = 'es'
  const pageRef = useRef(null)
  const [categoryName, setCategoryName] = useState(defaultCategoryName)
  useReveal(pageRef)

  const visibleMeals = getVisibleMeals(categoryName, language)
  const { day, night, pedidos } = menus

  const restaurantsTitle = {
    es: 'Más de 200 platos para pedir sin parar: elige tu menú, pide otra ronda y deja hueco para el postre.',
    cat: '',
    it: 'Prova subito tutti i nostri piatti e menù!'
  }
  const sectionLinks = [
    { id: 'menus', name: { es: 'Menús' } },
    { id: 'todo', name: { es: 'Todo lo que puedas comer' } },
    { id: 'platos', name: { es: 'Platos' } },
    { id: 'llevar', name: { es: 'Para llevar' } },
    { id: 'acompanar', name: { es: 'Postres y vinos' } },
  ]
  const menusWords = ['Menú Mediodía', 'Menú Noche', 'Sushi', 'Cocina japonesa', 'Comida china', 'Para llevar', 'A domicilio']

  const allYouCanEat = {
    es: ['Todo lo que puedas', 'comer'],
    cat: ['', ''],
    it: ['', '']
  }
  const allYouCanEatDescription = {
    es: 'Elige lo que quieras, saborea y disfruta todos nuestros deliciosos platos sin límites. Uramakis, nigiris, ramen, gua bao... y otra ronda, ¿por qué no?',
    cat: '',
    it: 'Scegli quello che vuoi, senza limiti e assapora tutti i nostri piatti'
  }
  const takeAway = {
    es: ['Tus favoritos,', 'donde quieras'],
    cat: ['', ''],
    it: ['', ''],
    en: ['', '']
  }
  const takeAwayDescription = {
    es: 'Escoge entre los numerosos platos que tenemos para llevar y disfrútalos en casa, en la oficina o donde te apetezca. Pide online en un minuto y te lo llevamos.',
    cat: '',
    it: ''
  }

  const dulcesTitle = {
    es: 'Nuestros Dulces',
    cat: '',
    it: ''
  }
  const vinosTitle = {
    es: 'Nuestros Vinos',
    cat: '',
    it: ''
  }
  const dulcesButton = {
    es: 'Carta Dulces',
    cat: '',
    it: ''
  }
  const vinosButton = {
    es: 'Carta Vinos',
    cat: '',
    it: ''
  }

  return (
    <div className='main-menu' ref={pageRef}>
      <header className='menus-hero'>
        <img className='menus-hero-bg' src={require('../images/home/home17.webp')} alt='' />
        <div className='menus-hero-content'>
          <p className='kicker'>Carta y menús</p>
          <h1 className='heading'>Nuestra carta de <em>sushi</em>, cocina japonesa y china</h1>
          <div className='menus-shortcuts'>
            <p className='menus-shortcuts-text'>{restaurantsTitle[language]}</p>
            <nav className='menus-shortcuts-links'>
              {sectionLinks.map(({ id, name }, index) => (
                <button key={id} type='button' onClick={() => scrollToSection(id)}>
                  <span className='menus-shortcut-number'>0{index + 1}</span>
                  <span className='menus-shortcut-name'>{name[language]}</span>
                  <span className='menus-shortcut-arrow'>↓</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <Marquee words={menusWords} />

      <section id='menus' className='menus-container'>
        <div className='section-header' data-reveal='up'>
          <p className='kicker'>Nuestros menús</p>
          <h2 className='heading'>Elige tu <em>momento</em></h2>
          <p className='lead'>A mediodía, por la noche o en casa: siempre hay una buena excusa para comer asiático.</p>
        </div>
        <div className='wrapper'>
          {[day, night, pedidos].map((menu, index) => <Menu key={menu.pdf} menu={menu} index={index} />)}
        </div>
      </section>

      <section id='todo' className='allYouCan'>
        <div className='container'>
          <div className='left' data-reveal='left'>
            <p className='kicker'>Asia Oriental Taste</p>
            <h2 className='heading'>{allYouCanEat[language][0]} <em>{allYouCanEat[language][1]}</em></h2>
            <p className='lead'>{allYouCanEatDescription[language]}</p>
            <div className='cta-buttons'>
              <a className='cta cta-red' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>Reservar mesa</a>
            </div>
          </div>
          <div className='mosaic' data-reveal='right'>
            {[1, 2, 3, 4].map((number) => (
              <img key={number} src={require(`../images/menus/allyoucaneat${number}.webp`)} alt='Platos del menú todo lo que puedas comer' loading='lazy' />
            ))}
          </div>
        </div>
      </section>

      <section id='platos' className='meals'>
        <div className='section-header' data-reveal='up'>
          <p className='kicker'>Algunos de nuestros platos</p>
          <h2 className='heading'>Elige tu <em>antojo</em></h2>
        </div>
        <div className='meals-tabs' data-reveal='up'>
          {meals.map((category) => (
            <button key={category.name[language]} type='button' className={category.name[language] === categoryName ? 'is-selected' : undefined} onClick={() => setCategoryName(category.name[language])}>
              <img src={require(`../images/mealsNoBg/${category.meals[0].photo}.webp`)} alt='' loading='lazy' />
              <span>{category.name[language]}</span>
            </button>
          ))}
        </div>
        <div key={categoryName} className='meals-grid'>
          {visibleMeals.map((meal, index) => <Dish key={meal.photo} dish={meal} index={index} />)}
        </div>
        <div className='cta-buttons'>
          <a className='cta cta-red' href='./pdfs/CartaNoche2024_compressed.pdf' target='_blank' rel='noreferrer'>Ver toda la carta</a>
        </div>
      </section>

      <section id='llevar' className='takeaway'>
        <div className='container'>
          <img data-reveal='left' src={require('../images/menus/takeAway.webp')} alt='Sushi para llevar' loading='lazy' />
          <div className='right' data-reveal='right'>
            <p className='kicker'>Para llevar</p>
            <h2 className='heading'>{takeAway[language][0]} <em>{takeAway[language][1]}</em></h2>
            <p className='lead'>{takeAwayDescription[language]}</p>
            <div className='cta-buttons'>
              <Link className='cta cta-red' to='/pedidos'>Pedir online</Link>
              <a className='cta cta-gold' href={pedidos.pdf} target='_blank' rel='noreferrer'>Carta para llevar</a>
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
          <div className='carta' data-reveal='up' style={revealDelay(0)}>
            <div className='carta-image carta-dulces' />
            <div className='carta-title'>{dulcesTitle[language]}</div>
            <div className='carta-button'>
              <a target='blank' >
                {dulcesButton[language]}
              </a>
            </div>
          </div>
          <div className='carta' data-reveal='up' style={revealDelay(1)}>
            <div className='carta-image carta-vinos' />
            <div className='carta-title'>{vinosTitle[language]}</div>
            <div className='carta-button'>
              <a href='./pdfs/CartaVinos2024v2_compressed.pdf' target='blank' >
                {vinosButton[language]}
              </a>
            </div>
          </div>
        </div>
      </section>

      <FinalCall />
      <Footer />
    </div>
  )
}

export default Menus
