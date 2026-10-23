import React, { useState } from 'react'
import { QuantityControl } from './DishCard'
import { formatPrice, getDeliveryQuote, pickupAddress } from './deliveryRules'
import { createOrderMessage, createWhatsappUrl } from './whatsappOrder'

const Field = ({ label, error, isTextarea, ...inputProps }) => (
    <label className={error ? 'pedidos-field invalid' : 'pedidos-field'}>
        <span>{label}</span>
        {isTextarea ? <textarea rows={3} {...inputProps} /> : <input {...inputProps} />}
        {error && <small>{error}</small>}
    </label>
)

// Field -> message; only the fields that stop the order
const getErrors = ({ cartItems, customer, type, quote }) => {
    const phoneDigits = customer.phone.replace(/\D/g, '')
    const errors = {
        cart: !cartItems.length && 'Añade al menos un plato.',
        name: !customer.name.trim() && 'Escribe tu nombre.',
        phone: (!phoneDigits && 'Escribe tu teléfono.') || (phoneDigits.length < 9 && 'El teléfono tiene que tener al menos 9 números.'),
        address: type === 'delivery' && !customer.address.trim() && 'Escribe la dirección de entrega.',
        postalCode: (quote.status === 'missingPostalCode' && 'Escribe tu código postal.') || (quote.status === 'invalidPostalCode' && 'El código postal tiene 5 números.'),
        minimum: quote.status === 'belowMinimum'
            && `El pedido mínimo para el ${customer.postalCode} es de ${formatPrice(quote.minimumOrderInCents)}: te faltan ${formatPrice(quote.missingForMinimumInCents)}.`,
    }
    return Object.fromEntries(Object.entries(errors).filter(([, error]) => error))
}

const getDeliveryInfo = (type, quote, postalCode) => {
    if (type === 'pickup') return `Recoges el pedido en ${pickupAddress}. Sin gastos de envío ni pedido mínimo.`
    if (quote.status === 'unknownZone') return `Todavía no tenemos tarifa para el ${postalCode}: el restaurante te dirá por WhatsApp si llega y cuánto cuesta el envío.`
    if (quote.missingForFreeDeliveryInCents > 0) return `Añade ${formatPrice(quote.missingForFreeDeliveryInCents)} más y el envío es gratis.`
    return ''
}

const getDeliveryFeeText = (type, quote) => {
    if (type === 'pickup') return formatPrice(0)
    if (quote.status === 'unknownZone') return 'A consultar'
    if (quote.status !== 'ok') return '—'
    return quote.deliveryFeeInCents ? formatPrice(quote.deliveryFeeInCents) : 'Gratis'
}

const OrderSheet = ({ cartItems, subtotalInCents, customer, setCustomer, onChangeQuantity, onClear, onClose }) => {
    const [showErrors, setShowErrors] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const { type } = customer
    const quote = getDeliveryQuote({ type, postalCode: customer.postalCode, subtotalInCents })
    const errors = getErrors({ cartItems, customer, type, quote })
    const visibleErrors = showErrors ? errors : {}
    const deliveryInfo = getDeliveryInfo(type, quote, customer.postalCode)

    const updateField = (field) => (event) => setCustomer({ ...customer, [field]: event.target.value })
    const updatePostalCode = (event) => setCustomer({ ...customer, postalCode: event.target.value.replace(/\D/g, '').slice(0, 5) })

    const sendOrder = () => {
        if (Object.keys(errors).length) {
            setShowErrors(true)
            return
        }
        const message = createOrderMessage({ cartItems, customer, type, quote, subtotalInCents })
        window.open(createWhatsappUrl(message), '_blank', 'noopener,noreferrer')
        setIsSent(true)
    }

    const startNewOrder = () => {
        onClear()
        setIsSent(false)
        setShowErrors(false)
    }

    return (
        <div className='pedidos-sheet-content'>
            <div className='pedidos-sheet-header'>
                <h2>Tu pedido</h2>
                <button type='button' className='pedidos-sheet-close' onClick={onClose} aria-label='Cerrar el pedido'>×</button>
            </div>

            <div className='pedidos-sheet-body'>
                {!cartItems.length && (
                    <p className='pedidos-empty'>Todavía no has añadido platos. Pulsa <b>+</b> en los que quieras pedir.</p>
                )}
                {!!cartItems.length && (
                    <ul className='pedidos-cart-items'>
                        {cartItems.map(({ dish, quantity }) => (
                            <li key={dish.number}>
                                <div className='pedidos-cart-item-name'>
                                    <span>{dish.number}. {dish.name.es}</span>
                                    <small>{formatPrice(dish.priceInCents)}</small>
                                </div>
                                <QuantityControl quantity={quantity} name={dish.name.es} size='small' onChange={(change) => onChangeQuantity(dish.number, change)} />
                                <span className='pedidos-cart-item-total'>{formatPrice(dish.priceInCents * quantity)}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <h3 className='pedidos-sheet-title'>¿Cómo lo quieres?</h3>
                <div className='pedidos-types' role='radiogroup' aria-label='Tipo de pedido'>
                    <button type='button' role='radio' aria-checked={type === 'delivery'} className={type === 'delivery' ? 'selected' : ''} onClick={() => setCustomer({ ...customer, type: 'delivery' })}>
                        <span className='pedidos-type-icon delivery' aria-hidden='true' />
                        Entrega a domicilio
                    </button>
                    <button type='button' role='radio' aria-checked={type === 'pickup'} className={type === 'pickup' ? 'selected' : ''} onClick={() => setCustomer({ ...customer, type: 'pickup' })}>
                        <span className='pedidos-type-icon pickup' aria-hidden='true' />
                        Recoger en el restaurante
                    </button>
                </div>

                <h3 className='pedidos-sheet-title'>Tus datos</h3>
                <div className='pedidos-form'>
                    <Field label='Nombre' value={customer.name} onChange={updateField('name')} autoComplete='name' error={visibleErrors.name} />
                    <Field label='Teléfono' value={customer.phone} onChange={updateField('phone')} type='tel' inputMode='tel' autoComplete='tel' error={visibleErrors.phone} />
                    {type === 'delivery' && (
                        <>
                            <Field label='Dirección' value={customer.address} onChange={updateField('address')} autoComplete='street-address' placeholder='Calle, número, piso' error={visibleErrors.address} />
                            <Field label='Código postal' value={customer.postalCode} onChange={updatePostalCode} inputMode='numeric' autoComplete='postal-code' placeholder='08720' error={visibleErrors.postalCode} />
                        </>
                    )}
                    <Field label='Observaciones (opcional)' value={customer.notes} onChange={updateField('notes')} isTextarea placeholder='Alergias, sin picante, timbre...' />
                </div>
                {deliveryInfo && <p className='pedidos-note'>{deliveryInfo}</p>}
                {quote.status === 'belowMinimum' && <p className='pedidos-warning'>{errors.minimum}</p>}
            </div>

            <div className='pedidos-sheet-footer'>
                <dl className='pedidos-totals'>
                    <div><dt>Subtotal</dt><dd>{formatPrice(subtotalInCents)}</dd></div>
                    <div><dt>Gastos de envío</dt><dd>{getDeliveryFeeText(type, quote)}</dd></div>
                    <div className='pedidos-total'>
                        <dt>{quote.status === 'unknownZone' ? 'Total sin envío' : 'Total'}</dt>
                        <dd>{formatPrice(quote.totalInCents ?? subtotalInCents)}</dd>
                    </div>
                </dl>
                {showErrors && !!Object.keys(errors).length && (
                    <p className='pedidos-warning' role='alert'>Para enviar el pedido: {Object.values(errors).join(' ')}</p>
                )}
                <button type='button' className='pedidos-whatsapp' onClick={sendOrder}>
                    <span className='pedidos-whatsapp-icon' aria-hidden='true' />
                    Enviar pedido por WhatsApp
                </button>
                {isSent
                    ? (
                        <p className='pedidos-note sent'>
                            Se ha abierto WhatsApp con tu pedido: pulsa <b>Enviar</b> allí. El restaurante te confirmará el pedido, el tiempo de entrega y el pago.{' '}
                            <button type='button' className='pedidos-link' onClick={startNewOrder}>Empezar un pedido nuevo</button>
                        </p>
                    )
                    : <p className='pedidos-small'>Se abrirá WhatsApp con el pedido escrito. No se paga nada ahora: el pago se acuerda con el restaurante.</p>}
            </div>
        </div>
    )
}

export default OrderSheet
