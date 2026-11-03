import restaurants from '../../Restaurant/restaurantsData'
import menus from '../../Menu/MenusData'

const { whatsapp, phone, street } = restaurants.orientalTaste

const reservationMessage = 'Hola, me gustaría reservar una mesa'

export const reservationWhatsappUrl = `${whatsapp}?text=${encodeURIComponent(reservationMessage)}`
export const phoneUrl = `tel:${phone.replace(/\s/g, '')}`
export const phoneText = phone
export const addressText = street
// 'Mediodía 12:30 – 16:00 · Noche 20:00 – 23:00', the times of the lunch and dinner menus
export const hoursText = [['Mediodía', menus.day], ['Noche', menus.night]]
    .map(([label, { time }]) => `${label} ${time.es.replace('-', '–')}`)
    .join(' · ')
