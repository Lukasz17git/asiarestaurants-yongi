import React, { useEffect, useMemo, useRef, useState } from 'react'
import Footer from '../../Footer'
import DishCard from './DishCard'
import OrderSheet from './OrderSheet'
import { updateQuantities } from './cart'
import { formatPrice } from './deliveryRules'
import { dishesByNumber, filterSections } from './takeawayMenu'
import { scrollToSection, useActiveSection } from './useSectionNav'
import { usePersistentState } from './usePersistentState'
import './pedidos.css'

const emptyCustomer = { type: 'delivery', name: '', phone: '', address: '', postalCode: '', notes: '' }

// { 12: 2 } -> [{ dish, quantity: 2 }], in menu order; skips numbers no longer on the menu
const getCartItems = (quantities) => Object.entries(quantities)
    .map(([number, quantity]) => ({ dish: dishesByNumber[number], quantity }))
    .filter(({ dish, quantity }) => dish && quantity > 0)
    .sort((a, b) => a.dish.number - b.dish.number)

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
                            <button type='button' key={section.id} data-section={section.id} className={section.id === activeId ? 'selected' : ''} onClick={() => scrollToSection(section.id, toolbarRef)}>
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
