import React from 'react'
import BigRoulette from '../BigRoulette'

const Section1 = () => {
  const language = 'es'
  const question = {
    es: 'Quiénes somos?',
    cat: '',
    en: 'Who are we?'
  }
  const description1 = {
    es: 'En nuestros Restaurantes ASIA proporcionamos las recetas más tradicionales y originales de la cocina oriental.',
    cat: '',
    it: 'I ristoranti ASIA offrono ai propri ospiti ricette tradizionali della cucina giapponese e tanto altro.',
    en: ''
  }
  const description2 = {
    es: 'Especialistas en fusión, desde la cultura china hasta la cultura japonesa.',
    cat: '',
    it: 'Specialità fusion, dalla cultura Cinese alla cultura Giapponese.',
    en: ''
  }
  const description3 = {
    es: 'Tenemos mas de 200 platos ansiosos para ser probados!',
    cat: '',
    it: 'Oltre 200 piatti da provare!',
    en: ''
  }
  return (
    <div className='section1'>
      <div className='top'>
        <div className='line'></div>
        <div className='icon'></div>
        <div className='line'></div>
      </div>
      <div className='who'>{question[language]}</div>
      <div className='title'>Asia Restaurants</div>
      <div className='description'>
        <div>{description1[language]}</div>
        <div>{description2[language]}</div>
        <div>{description3[language]}</div>
      </div>
      <BigRoulette/>
    </div>
  )
}

export default Section1