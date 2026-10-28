import React from 'react'
import { Link } from 'react-router-dom'
import { addressText, phoneText, phoneUrl, reservationWhatsappUrl } from './reservation'
import './sections.css'

// Last call before the footer: book a table, order online or see the menu
const FinalCall = () => {
    return (
        <section className='final-call'>
            <div className='final-call-content' data-reveal='zoom'>
                <p className='kicker'>Te estamos esperando</p>
                <h2 className='heading'>Tu mesa <em>te espera</em></h2>
                <p className='lead'>Las mesas del fin de semana son limitadas. Resérvala ahora por WhatsApp o llámanos, ven con hambre y nosotros ponemos el resto.</p>
                <div className='cta-buttons'>
                    <a className='cta cta-red' href={reservationWhatsappUrl} target='_blank' rel='noreferrer'>Reservar por WhatsApp</a>
                    <a className='cta cta-gold' href={phoneUrl}>Llamar al {phoneText.replace('+34 ', '')}</a>
                </div>
                <p className='final-call-links'>
                    <Link to='/menu'>Ver carta</Link>
                    <span>·</span>
                    <Link to='/pedidos'>Pedir online</Link>
                    <span>·</span>
                    <Link to='/restaurant'>{addressText}</Link>
                </p>
            </div>
        </section>
    )
}

export default FinalCall
