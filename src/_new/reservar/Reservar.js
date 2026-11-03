import React, { useRef, useState } from 'react'
import Footer from '../../Footer'
import { ioyiPhoto } from '../images/ioyi/photos'
import { useReveal } from '../reveal/useReveal'
import { createReservationUrl, getNextDays, isPastSlot, openingHours, phoneText, phoneUrl, toDateValue } from '../sections/reservation'
import './reservar.css'

const peopleOptions = ['1', '2', '3', '4', '5', '6', 'Más de 6']
const weekdayFormat = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
const monthFormat = new Intl.DateTimeFormat('es-ES', { month: 'long' })

const getDayLabel = (date, index) => ['Hoy', 'Mañana'][index] || weekdayFormat.format(date).replace('.', '')

const getErrors = ({ people, date, time, name, phone }) => {
    const phoneDigits = phone.replace(/\D/g, '')
    const errors = {
        people: !people && 'Elige cuántos sois.',
        date: (!date || date < toDateValue(new Date())) && 'Elige el día.',
        time: (!time || isPastSlot(date, time)) && 'Elige la hora.',
        name: !name.trim() && 'Escribe tu nombre.',
        phone: (!phoneDigits && 'Escribe tu teléfono.') || (phoneDigits.length < 9 && 'El teléfono tiene que tener al menos 9 números.'),
    }
    return Object.fromEntries(Object.entries(errors).filter(([, error]) => error))
}

const Question = ({ kanji, text, children }) => (
    <div className='reservar-group'>
        <p className='reservar-label'><i>{kanji}</i>{text}</p>
        {children}
    </div>
)

const Chip = ({ isOn, className = 'reservar-chip', ...buttonProps }) => (
    <button type='button' className={isOn ? `${className} is-on` : className} aria-pressed={isOn} {...buttonProps} />
)

const Field = ({ label, error, ...inputProps }) => (
    <label className={error ? 'reservar-field invalid' : 'reservar-field'}>
        <span>{label}</span>
        <input {...inputProps} />
        {error && <small>{error}</small>}
    </label>
)

// «Reservar» page: a booking form that sends the reservation written in a WhatsApp message
const Reservar = () => {
    const [booking, setBooking] = useState({ people: '', date: '', time: '', name: '', phone: '' })
    const [isOtherDay, setIsOtherDay] = useState(false)
    const [showErrors, setShowErrors] = useState(false)
    const otherDayRef = useRef(null)
    const pageRef = useRef(null)
    useReveal(pageRef)

    const days = getNextDays(6)
    const today = toDateValue(days[0])
    const months = [...new Set(days.map((date) => monthFormat.format(date)))].join(' – ')
    const errors = getErrors(booking)
    const visibleErrors = showErrors ? errors : {}

    const update = (changes) => setBooking((current) => ({ ...current, ...changes }))
    // A time already gone on the new day is dropped
    const pickDate = (date) => update({ date, time: booking.time && isPastSlot(date, booking.time) ? '' : booking.time })
    const pickNextDay = (date) => {
        setIsOtherDay(false)
        pickDate(date)
    }
    const pickOtherDay = () => {
        setIsOtherDay(true)
        update({ date: '' })
        setTimeout(() => otherDayRef.current?.showPicker?.())
    }
    const updateField = (field) => (event) => update({ [field]: event.target.value })

    const send = (event) => {
        event.preventDefault()
        setShowErrors(true)
        if (Object.keys(errors).length) return
        window.open(createReservationUrl(booking), '_blank', 'noopener,noreferrer')
    }

    return (
        <div ref={pageRef}>
            <section className='reservar'>
                <div className='reservar-head' data-reveal='up'>
                    <p className='kicker'>Solo 20 plazas</p>
                    <h1 className='heading'>Reserva tu <em>mesa</em></h1>
                </div>
                <form className='reservar-sheet' onSubmit={send} noValidate data-reveal='zoom'>
                    <div className='reservar-form'>
                        <Question kanji='一' text='¿Cuántos sois?'>
                            <div className='reservar-row'>
                                {peopleOptions.map((people) => (
                                    <Chip key={people} isOn={booking.people === people} onClick={() => update({ people })}>{people}</Chip>
                                ))}
                            </div>
                        </Question>
                        <Question kanji='二' text='¿Qué día?'>
                            <p className='reservar-month'>{months}</p>
                            <div className='reservar-row'>
                                {days.map((date, index) => {
                                    const dateValue = toDateValue(date)
                                    return (
                                        <Chip key={dateValue} className='reservar-day' isOn={!isOtherDay && booking.date === dateValue} onClick={() => pickNextDay(dateValue)}>
                                            <small>{getDayLabel(date, index)}</small>
                                            <b>{date.getDate()}</b>
                                        </Chip>
                                    )
                                })}
                                <Chip className='reservar-day reservar-other-day' isOn={isOtherDay} onClick={pickOtherDay}>
                                    <small>Otro día</small>
                                    <b>{isOtherDay && booking.date ? Number(booking.date.slice(-2)) : '📅'}</b>
                                </Chip>
                            </div>
                            {isOtherDay && (
                                <input ref={otherDayRef} className='reservar-date' type='date' min={today} value={booking.date} onChange={(event) => pickDate(event.target.value)} aria-label='Otro día' />
                            )}
                        </Question>
                        <Question kanji='三' text='¿A qué hora?'>
                            {openingHours.map(({ label, slots }) => (
                                <div key={label} className='reservar-slots'>
                                    <span>{label}</span>
                                    <div className='reservar-row'>
                                        {slots.map((slot) => (
                                            <Chip key={slot} isOn={booking.time === slot} disabled={isPastSlot(booking.date, slot)} onClick={() => update({ time: slot })}>{slot}</Chip>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Question>
                        <Question kanji='四' text='¿A nombre de quién?'>
                            <div className='reservar-fields'>
                                <Field label='Nombre' value={booking.name} onChange={updateField('name')} autoComplete='name' error={visibleErrors.name} />
                                <Field label='Teléfono' value={booking.phone} onChange={updateField('phone')} type='tel' inputMode='tel' autoComplete='tel' error={visibleErrors.phone} />
                            </div>
                        </Question>
                    </div>
                    <div className='reservar-info'>
                        <figure className='reservar-photo'>
                            <img src={ioyiPhoto('place/ioyi-cover')} alt='Dos ramen de IOYI en una mesa de madera' loading='lazy' />
                            <figcaption>IOYI Ramen · Vilafranca del Penedès</figcaption>
                        </figure>
                        <div className='reservar-hours'>
                            <b className='reservar-mini'>Horario</b>
                            <p>Todos los días</p>
                            {openingHours.map(({ label, time }) => (
                                <div key={label} className='reservar-hours-row'><span>{label}</span><b>{time}</b></div>
                            ))}
                        </div>
                    </div>
                    <div className='reservar-send'>
                        <button type='submit' className='cta cta-red'>
                            <span className='reservar-whatsapp-icon' aria-hidden='true' />
                            Enviar por WhatsApp
                        </button>
                        {showErrors && !!Object.keys(errors).length && (
                            <p className='reservar-warning' role='alert'>Para reservar: {Object.values(errors).join(' ')}</p>
                        )}
                        <p className='reservar-note'>
                            Te contestamos por WhatsApp para confirmar la mesa. ¿Más de 6 o para hoy mismo? Llámanos al <a href={phoneUrl}>{phoneText.replace('+34 ', '')}</a>.
                        </p>
                    </div>
                </form>
            </section>
            <Footer />
        </div>
    )
}

export default Reservar
