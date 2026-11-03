import restaurants from '../../Restaurant/restaurantsData'

const { whatsapp, phone, street, instagram, hours } = restaurants.ioyi

const reservationMessage = 'Hola, me gustaría reservar una mesa'

export const reservationWhatsappUrl = `${whatsapp}?text=${encodeURIComponent(reservationMessage)}`
export const phoneUrl = `tel:${phone.replace(/\s/g, '')}`
export const phoneText = phone
export const addressText = street
export const instagramUrl = instagram
// 'Todos los días · 13:00 – 15:30 y 19:30 – 22:30'
export const hoursText = `Todos los días · ${hours.map(({ time }) => time).join(' y ')}`
