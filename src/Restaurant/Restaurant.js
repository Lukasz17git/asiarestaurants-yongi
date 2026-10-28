import React from 'react'
import asiaCorreggio from '../images/restaurants/asiaCorreggio.webp'
import asiaRavenna from '../images/restaurants/asiaRavenna.webp'
import asiaReggioEmilia from '../images/restaurants/asiaReggioEmilia.webp'
import asiaOrientalTaste from '../images/restaurants/asiaOrientalTaste.webp'
import gold from '../generateGold'

const Restaurant = ({ data }) => {
    const language = 'es'
    const restaurant = {
        es: 'Restaurante',
        cat: 'Restaurante'
    }
    const streetLabel = {
        es: 'C:',
        cat: 'C:'
    }
    const phoneLabel = {
        es: 'Tlf:',
        cat: 'Tlf'
    }
    const whatsappLabel = {
        es: 'Háblanos',
        cat: 'Hablanos'
    }
    const images = { asiaCorreggio, asiaRavenna, asiaReggioEmilia, asiaOrientalTaste }

    const { name, country, street, phone, maps, whatsapp, image, description } = data
    const openWhatsApp = () => window.open(whatsapp, '_blank')

    return (
        <div className='section'>
            <div className='title' data-reveal='up'>{gold(restaurant[language] + ' ' + name)}</div>
            <div className='description' data-reveal='up'>{description[language]}</div>
            <div className='section-container'>
                <div className='wrapper1' data-reveal='left'>
                    <img alt='restaurant' src={images[image]} />
                </div>
                <div className='wrapper2' data-reveal='right'>
                    <div className='info'>
                        <div className={'country ' + country} />
                        <div className='wrapper'>
                            <div className='street'>{streetLabel[language] + ' ' + street}</div>
                            <div className='phone'>{phoneLabel[language] + ' ' + phone}</div>
                        </div>
                        <div onClick={openWhatsApp} className='whatsapp' >
                            <div className='icon'></div>
                            <div>{whatsappLabel[language]}</div>
                        </div>
                    </div>
                    <div className='maps'>
                        <iframe title='Correggio' width="400" height="300" src={maps} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Restaurant