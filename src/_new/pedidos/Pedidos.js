import React, { useEffect, useMemo, useRef, useState } from 'react'
import Footer from '../../Footer'
import DishCard from './DishCard'
import OrderSheet from './OrderSheet'
import { formatPrice } from './deliveryRules'
import { dishesByNumber, filterSections } from './takeawayMenu'
import { usePersistentState } from './usePersistentState'
import './pedidos.css'

const emptyCustomer = { type: 'delivery', name: '', phone: '', address: '', postalCode: '', notes: '' }

// { 12: 2 } -> [{ dish, quantity: 2 }], in menu order; skips numbers no longer on the menu
const getCartItems = (quantities) => Object.entries(quantities)
    .map(([number, quantity]) => ({ dish: dishesByNumber[number], quantity }))
    .filter(({ dish, quantity }) => dish && quantity > 0)
    .sort((a, b) => a.dish.number - b.dish.number)

const updateQuantities = (quantities, number, change) => {
    const quantity = (quantities[number] ?? 0) + change
    const { [number]: _removed, ...otherQuantities } = quantities
    return quantity > 0 ? { ...otherQuantities, [number]: quantity } : otherQuantities
}

const getSectionElement = (id) => document.getElementById(`seccion-${id}`)

// Highlights the chip of the last section whose top has passed under the search bar, and scrolls the chip into view
const useActiveSection = (sectionIds, toolbarRef, chipsRef) => {
    const [activeId, setActiveId] = useState(sectionIds[0])

    useEffect(() => {
        let frame = null
        let idleTimer = null

        const getActiveId = () => {
            const toolbarBottom = toolbarRef.current.getBoundingClientRect().bottom
            const passedIds = sectionIds.filter((id) => getSectionElement(id)?.getBoundingClientRect().top <= toolbarBottom + 8)
            return passedIds[passedIds.length - 1] ?? sectionIds[0]
        }
        const scrollChipIntoView = () => {
            const chips = chipsRef.current
            const chip = chips?.querySelector(`[data-section='${getActiveId()}']`)
            if (chip) chips.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' })
        }
        const onScroll = () => {
            frame ??= requestAnimationFrame(() => {
                frame = null
                setActiveId(getActiveId())
            })
            // Waits until the page stops: in Chrome a smooth scroll of the chip row stops the page's smooth scroll
            clearTimeout(idleTimer)
            idleTimer = setTimeout(scrollChipIntoView, 150)
        }

        setActiveId(getActiveId())
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (frame) cancelAnimationFrame(frame)
            clearTimeout(idleTimer)
        }
    }, [sectionIds, toolbarRef, chipsRef])

    return activeId
}

const Pedidos = () => {
    const [search, setSearch] = useState('')
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [quantities, setQuantities] = usePersistentState('pedidos-carrito', {})
    const [customer, setCustomer] = usePersistentState('pedidos-datos', emptyCustomer)
    const toolbarRef = useRef(null)
    const chipsRef = useRef(null)

    const sections = useMemo(() => filterSections(search), [search])
    const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])
    const activeId = useActiveSection(sectionIds, toolbarRef, chipsRef)

    const cartItems = getCartItems(quantities)
    const subtotalInCents = cartItems.reduce((total, { dish, quantity }) => total + dish.priceInCents * quantity, 0)
    const dishesCount = cartItems.reduce((total, { quantity }) => total + quantity, 0)

    const changeQuantity = (number, change) => setQuantities((current) => updateQuantities(current, number, change))

    // Only the mobile sheet covers the page; on wide screens the order is a column beside the menu
    useEffect(() => {
        document.body.classList.toggle('pedidos-sheet-open', isSheetOpen)
        return () => document.body.classList.remove('pedidos-sheet-open')
    }, [isSheetOpen])

    // Puts the section's title right under the search bar, which is sticky and so not counted by scrollIntoView.
    // Jumps of more than 3 screens are instant: a smooth one over the whole menu takes about 3s
    const goToSection = (id) => {
        const distance = getSectionElement(id).getBoundingClientRect().top - toolbarRef.current.getBoundingClientRect().bottom
        const behavior = Math.abs(distance) > window.innerHeight * 3 ? 'auto' : 'smooth'
        window.scrollTo({ top: window.scrollY + distance, behavior })
    }

    return (
        <>
            <div className='pedidos'>
                <header className='pedidos-hero'>
                    <p className='pedidos-kicker'>IOYI Asia Delivery · Vilafranca del Penedès</p>
                    <h1>Pide online</h1>
                    <p className='pedidos-intro'>Elige tus platos de la carta para llevar y envíanos el pedido por WhatsApp en un momento.</p>
                    <ol className='pedidos-steps'>
                        <li><span>1</span>Elige tus platos</li>
                        <li><span>2</span>Pon tus datos</li>
                        <li><span>3</span>Envíalo por WhatsApp</li>
                    </ol>
                    <p className='pedidos-perks'>
                        <span>Envío gratis en Vilafranca (08720) desde 20 €</span>
                        <span>Recogida sin pedido mínimo</span>
                    </p>
                </header>

                <div className='pedidos-toolbar' ref={toolbarRef}>
                    <div className='pedidos-search'>
                        <input type='search' value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Busca un plato o su número' aria-label='Buscar plato' />
                    </div>
                    <nav className='pedidos-chips' ref={chipsRef} aria-label='Secciones de la carta'>
                        {sections.map((section) => (
                            <button type='button' key={section.id} data-section={section.id} className={section.id === activeId ? 'selected' : ''} onClick={() => goToSection(section.id)}>
                                {section.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className='pedidos-layout'>
                    <main className='pedidos-menu'>
                        {!sections.length && <p className='pedidos-empty'>No hay platos que coincidan con «{search}».</p>}
                        {sections.map((section) => (
                            <section key={section.id} id={`seccion-${section.id}`} className='pedidos-section'>
                                <div className='pedidos-section-header'>
                                    {section.photoUrl && <img src={section.photoUrl} alt='' loading='lazy' />}
                                    <h2>{section.name}</h2>
                                    {section.note && <span>{section.note}</span>}
                                </div>
                                <div className='pedidos-dishes'>
                                    {section.dishes.map((dish) => (
                                        <DishCard key={dish.number} dish={dish} quantity={quantities[dish.number] ?? 0} onChange={(change) => changeQuantity(dish.number, change)} />
                                    ))}
                                </div>
                            </section>
                        ))}
                        <p className='pedidos-small center'>Si tienes alguna alergia, indícalo en las observaciones del pedido.</p>
                    </main>

                    <aside className={isSheetOpen ? 'pedidos-sheet open' : 'pedidos-sheet'} aria-label='Tu pedido'>
                        <OrderSheet
                            cartItems={cartItems}
                            subtotalInCents={subtotalInCents}
                            customer={customer}
                            setCustomer={setCustomer}
                            onChangeQuantity={changeQuantity}
                            onClear={() => setQuantities({})}
                            onClose={() => setIsSheetOpen(false)}
                        />
                    </aside>
                    <div className={isSheetOpen ? 'pedidos-backdrop open' : 'pedidos-backdrop'} onClick={() => setIsSheetOpen(false)} />
                </div>

                {!isSheetOpen && (
                    <button type='button' className={dishesCount ? 'pedidos-cart-bar' : 'pedidos-cart-bar empty'} onClick={() => setIsSheetOpen(true)}>
                        <span className='pedidos-cart-count'>{dishesCount}</span>
                        <span>{dishesCount ? 'Ver mi pedido' : 'Tu pedido está vacío'}</span>
                        <span className='pedidos-cart-price'>{formatPrice(subtotalInCents)}</span>
                    </button>
                )}
            </div>
            <Footer />
        </>
    )
}

export default Pedidos
