// No zone confirmed by IOYI yet: every postal code gets 'unknownZone' (fee asked by WhatsApp)
export const deliveryZones = {}

export const pickupAddress = 'Carrer de la Indústria, 7, 08720 Vilafranca del Penedès'

// 1550 -> '15,50 €'
export const formatPrice = (priceInCents) => `${Math.floor(priceInCents / 100)},${String(priceInCents % 100).padStart(2, '0')} €`

export const isValidPostalCode = (postalCode) => /^\d{5}$/.test(postalCode)

// status: 'ok' | 'missingPostalCode' | 'invalidPostalCode' | 'unknownZone' (fee to ask by WhatsApp) | 'belowMinimum'
export const getDeliveryQuote = ({ type, postalCode, subtotalInCents }) => {
    if (type === 'pickup') return { status: 'ok', deliveryFeeInCents: 0, totalInCents: subtotalInCents }
    if (!postalCode) return { status: 'missingPostalCode' }
    if (!isValidPostalCode(postalCode)) return { status: 'invalidPostalCode' }

    const zone = deliveryZones[postalCode]
    if (!zone) return { status: 'unknownZone', totalInCents: subtotalInCents }

    const missingForMinimumInCents = zone.minimumOrderInCents - subtotalInCents
    if (missingForMinimumInCents > 0) return { status: 'belowMinimum', minimumOrderInCents: zone.minimumOrderInCents, missingForMinimumInCents }

    const isFree = zone.freeDeliveryFromInCents && subtotalInCents >= zone.freeDeliveryFromInCents
    const deliveryFeeInCents = isFree ? 0 : zone.deliveryFeeInCents
    const missingForFreeDeliveryInCents = !isFree && zone.freeDeliveryFromInCents ? zone.freeDeliveryFromInCents - subtotalInCents : 0
    return { status: 'ok', deliveryFeeInCents, totalInCents: subtotalInCents + deliveryFeeInCents, missingForFreeDeliveryInCents }
}
