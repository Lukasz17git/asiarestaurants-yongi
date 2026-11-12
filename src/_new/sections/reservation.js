import restaurants from '../../Restaurant/restaurantsData'

const { whatsapp, phone, street, instagram, hours } = restaurants.ioyi

export const phoneUrl = `tel:${phone.replace(/\s/g, '')}`
export const phoneText = phone
export const addressText = street
export const instagramUrl = instagram
// 'Todos los días · 13:00 – 15:30 y 19:30 – 22:30'
export const hoursText = `Todos los días · ${hours.map(({ time }) => time).join(' y ')}`
const toMinutes = (timeText) => {
    const [hour, minute] = timeText.split(':').map(Number)
    return hour * 60 + minute
}

const toTimeText = (minutes) => [Math.floor(minutes / 60), minutes % 60].map((part) => String(part).padStart(2, '0')).join(':')

// '13:00 – 15:30' -> ['13:00', '13:30', '14:00', '14:30', '15:00']: every half hour until 30 minutes before closing
const getTimeSlots = (time) => {
    const [opening, closing] = time.split('–').map((part) => toMinutes(part.trim()))
    return Array.from({ length: (closing - opening) / 30 }, (_, index) => toTimeText(opening + index * 30))
}

// [{ label: 'Mediodía', time: '13:00 – 15:30', slots: ['13:00', ...] }, ...]
export const openingHours = hours.map(({ days, time }) => ({ label: days.es, time, slots: getTimeSlots(time) }))

// '2026-11-07' in local time (toISOString would give the UTC day, one day off after midnight in Spain)
export const toDateValue = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')

// Today's slots that already started can't be booked
export const isPastSlot = (dateValue, slot) => {
    const now = new Date()
    return dateValue === toDateValue(now) && toMinutes(slot) <= now.getHours() * 60 + now.getMinutes()
}

// Today and the next days, from the visitor's clock: always current without a rebuild
export const getNextDays = (count) => Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    return date
})

const longDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

// '2026-11-07' -> 'Sábado 7 de noviembre'
const formatLongDate = (dateValue) => {
    const [year, month, day] = dateValue.split('-').map(Number)
    const text = longDate.format(new Date(year, month - 1, day)).replace(',', '')
    return text[0].toUpperCase() + text.slice(1)
}

// Always in Spanish, for the restaurant; people is '1' to '6' or 'Más de 6'
// No emojis: through wa.me they arrive as '�'. WhatsApp shows *text* in bold
export const createReservationUrl = ({ people, date, time, name, phone: customerPhone }) => {
    const message = [
        'Hola, me gustaría reservar una mesa en IOYI Ramen:',
        '',
        `*Personas:* ${people}`,
        `*Día:* ${formatLongDate(date)}`,
        `*Hora:* ${time}`,
        `*Nombre:* ${name.trim()}`,
        `*Teléfono:* ${customerPhone.trim()}`,
        '',
        '¿Nos confirmáis la mesa? ¡Gracias!',
    ].join('\n')
    return `${whatsapp}?text=${encodeURIComponent(message)}`
}
