import React from 'react'
import gold from '../generateGold'
import { ioyiPhoto } from '../_new/images/ioyi/photos'

const Restaurant = ({ data }) => {
    const language = 'es'
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

    const { name, street, city, phone, maps, whatsapp, instagram, image, hours, description } = data

    return (
        <div className='section'>
            <div className='title' data-reveal='up'>{gold(name)}</div>
            <div className='description' data-reveal='up'>{description[language]}</div>
            <div className='section-container'>
                <div className='wrapper1' data-reveal='left'>
                    <img alt={name} src={ioyiPhoto(`place/${image}`)} />
                </div>
                <div className='wrapper2' data-reveal='right'>
                    <div className='info'>
                        <div className='wrapper'>
                            <div className='street'>{`${streetLabel[language]} ${street}, ${city}`}</div>
                            <div className='phone'>{phoneLabel[language] + ' ' + phone}</div>
                            <ul className='hours'>
                                {hours.map(({ days, time }) => (
                                    <li key={time}><span>{days[language]}</span>{time}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='buttons'>
                            <a href={whatsapp} target='_blank' rel='noreferrer' className='whatsapp'>
                                <div className='icon'></div>
                                <div>{whatsappLabel[language]}</div>
                            </a>
                            <a href={instagram} target='_blank' rel='noreferrer' className='whatsapp is-instagram'>
                                <div className='icon'></div>
                                <div>Instagram</div>
                            </a>
                        </div>
                    </div>
                    <div className='maps'>
                        <iframe title={name} width="400" height="300" src={maps} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Restaurant