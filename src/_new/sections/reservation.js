import restaurants from '../../Restaurant/restaurantsData'

const { whatsapp, phone, street } = restaurants.orientalTaste

const reservationMessage = 'Hola, me gustaría reservar una mesa'

export const reservationWhatsappUrl = `${whatsapp}?text=${encodeURIComponent(reservationMessage)}`
export const phoneUrl = `tel:${phone.replace(/\s/g, '')}`
export const phoneText = phone
export const addressText = street
