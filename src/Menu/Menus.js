import React from 'react'
import Footer from '../Footer'
import '../css/Menu.css'
import Menu from './Menu'
import menus from './MenusData'
import meals from './MealsData'
import Roulette from '../Roulette'
import Category from './Category'
import Dish from './Dish'
import gold from '../generateGold'

const Menus = () => {
  const language = 'es'
  const name = 'Asia Oriental Taste'.toUpperCase().split('')
  const restaurantsTitle = {
    es: 'Prueba todos nuestros platos y menús ahora!',
    cat: '',
    it: 'Prova subito tutti i nostri piatti e menù!'
  }
  const menusTitle = {
    es: 'Nuestros Menús',
    cat: '',
    it: 'I nostri menù'
  }
  const { day, night, pedidos } = menus

  const acompañamientosTitle = {
    es: 'Para Acompañar',
    cat: '',
    it: ''
  }

  const allYouCanEat = {
    es: 'Todo lo que puedas comer',
    cat: '',
    it: ''
  }
  const allYouCanEatDescription = {
    es: 'Elige lo que quieras, saborea y disfruta todos nuestros deliciosos platos sin límites',
    cat: '',
    it: 'Scegli quello che vuoi, senza limiti e assapora tutti i nostri piatti'
  }
  const takeAway = {
    es: 'Para llevar',
    cat: '',
    it: '',
    en: 'Take Away'
  }
  const takeAwayDescription = {
    es: 'Escoge entre los numerosos platos que tenemos disponibles para ti para poder ser disfrutados en el lugar que quieras',
    cat: '',
    it: ''
  }

  const mealsTitle = {
    es: 'Algunos de Nuestros Platos',
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
    <div className='main-menu'>
      <div className='bg-wrapper'>
        <div className='title-menu'>
          {name.map((letter, index) => <div key={index} className='letter' style={{ transform: `translate(-50%,-50%) rotate(${index * (160 / (name.length - 1)) - 80}deg)` }}>{letter}</div>)}
          <div className='logo' />
        </div>
        <div className='restaurant-title'>{restaurantsTitle[language]}</div>
        <div className='menu-top'>
          <div className='line' />
          <div className='icon' />
          <div className='line' />
        </div>
      </div>
      <div className='menus-container'>
        <div className='menus-section'>{gold(menusTitle[language])}</div>
        <div className='wrapper'>
          <Menu menu={day} />
          <Menu menu={night} />
          <Menu menu={pedidos} />
          {/* <Menu menu={festive} /> */}
        </div>
      </div>

      <div className='cartas'>
        <div className='menu-top'>
          <div className='line' />
          <div className='name font1'>Asia Oriental Taste</div>
          <div className='line' />
        </div>
        <div className='menus-section'>{gold(acompañamientosTitle[language])}</div>
        <div className='wrapper'>
          <div className='carta'>
            <div className='carta-bg'>
              <div className='carta-title'>{dulcesTitle[language]}</div>
              <div className='carta-button'>
                <a target='blank' >
                  {dulcesButton[language]}
                </a>
              </div>
              <div className='carta-image carta-dulces' />
            </div>
          </div>
          <div className='carta'>
            <div className='carta-bg'>
              <div className='carta-title'>{vinosTitle[language]}</div>
              <div className='carta-button'>
                <a href='./pdfs/CartaVinos2024v2_compressed.pdf' target='blank' >
                  {vinosButton[language]}
                </a></div>
              <div className='carta-image carta-vinos' />
            </div>
          </div>
        </div>
      </div>

      <div className='allYouCan'>
        <div className='container'>
          <div className='left'>
            <div className='name font1'>Asia Oriental Taste</div>
            <div className='title'>{gold(allYouCanEat[language])}</div>
            <div className='description font4'>{allYouCanEatDescription[language]}</div>
          </div>
          <div className='right' >
            <Roulette />
          </div>
        </div>
      </div>

      <div className='takeaway'>
        <div className='main-title'>{gold(takeAway[language])}</div>
        <img alt='restaurant' />
        <div className='promo'>{takeAwayDescription[language]}</div>
        <div className='wrapper'>
          <Menu menu={pedidos} />
        </div>
      </div>

      <div className='meals'>
        <div className='fan' />
        <div className='main-title'>{gold(mealsTitle[language])}</div>
        {meals.map((category =>
          <Category key={category.name[language]} name={category.name[language]}>
            {category.meals.map(meal => <Dish key={meal.name} dish={meal} />)}
          </Category>))}
        <div className='wrapper'>
          <a href='./pdfs/CartaNoche2024_compressed.pdf' target='blank'>
            <div className='menus'>
              <div className='name'>Ver Todo</div>
              <div className='arrow' />
            </div>
          </a>
        </div>
        <div className='fan2' />
      </div>


      <Footer />
    </div>
  )
}

export default Menus
