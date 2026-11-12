import React from 'react'
import { Link } from 'react-router-dom'
import { addressText, hoursText, phoneText, phoneUrl } from './reservation'
import './sections.css'

// Last call before the footer: book a table, order online or see the menu
const FinalCall = () => {
    return (
        <section className='final-call'>
            <div className='final-call-content' data-reveal='zoom'>
                <p className='kicker'>Solo 20 plazas</p>
                <h2 className='heading'>Tu bol <em>te espera</em></h2>
                <p className='lead'>Somos un local pequeño y se llena rápido. Reserva por WhatsApp o llámanos, ven con hambre y nosotros ponemos el caldo.</p>
                <p className='final-call-hours'>{hoursText}</p>
                <div className='cta-buttons'>
                    <Link className='cta cta-red' to='/reservar'>Reservar mesa</Link>
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
