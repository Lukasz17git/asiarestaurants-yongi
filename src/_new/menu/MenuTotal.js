import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../Footer'
import menus from '../../Menu/MenusData'
import DishDetail from './DishDetail'
import MenuDishCard from './MenuDishCard'
import { updateQuantities } from '../pedidos/cart'
import { formatPrice } from '../pedidos/deliveryRules'
import { dishesByNumber, filterSections, menuSections } from '../pedidos/takeawayMenu'
import { usePersistentState } from '../pedidos/usePersistentState'
import { scrollToSection, useActiveSection } from '../pedidos/useSectionNav'
import './menuTotal.css'

const allDishes = menuSections.flatMap((section) => section.dishes)
const veganDishesCount = allDishes.filter((dish) => dish.isVegan).length

const heroPhotoUrls = ['uramaki-tiger', 'ramen-beef', 'baozi'].map((photo) => require(`../images/menuMaker/${photo}.webp`))

const extraMenus = [
    { name: 'Nuestros vinos', time: 'Para acompañar', pdf: './pdfs/CartaVinos2024v2_compressed.pdf' },
]

// '- viernes y  festivos + 1€ -' -> 'viernes y festivos + 1€'
const cleanPriceNote = (note) => note?.replace(/^[\s-]+|[\s-]+$/g, '').replace(/\s+/g, ' ')

// '(8 unidades)' -> '8 unidades'
const cleanSectionNote = (note) => note.replace(/[()]/g, '')

// Spicy Pot has no photo, so its chip has no picture
const getSectionThumbnail = (section) => section.photoUrl ?? section.dishes.find((dish) => dish.photoUrl)?.photoUrl

const filterByTags = (sections, { onlyVegan, onlySpicy }) => {
    if (!onlyVegan && !onlySpicy) return sections
    return sections
        .map((section) => ({ ...section, dishes: section.dishes.filter((dish) => (!onlyVegan || dish.isVegan) && (!onlySpicy || dish.isSpicy)) }))
        .filter((section) => section.dishes.length)
}

const MenuTotal = () => {
    const [search, setSearch] = useState('')
    const [onlyVegan, setOnlyVegan] = useState(false)
    const [onlySpicy, setOnlySpicy] = useState(false)
    const [selected, setSelected] = useState(null)
    // Same cart as «Pedir online», so a dish added here is already there
    const [quantities, setQuantities] = usePersistentState('pedidos-carrito', {})
    const toolbarRef = useRef(null)
    const chipsRef = useRef(null)
    const menusRef = useRef(null)
    const isFirstRender = useRef(true)

    const sections = useMemo(() => filterByTags(filterSections(search), { onlyVegan, onlySpicy }), [search, onlyVegan, onlySpicy])
    const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])
    const activeId = useActiveSection(sectionIds, toolbarRef, chipsRef)
    const shownDishesCount = sections.reduce((total, section) => total + section.dishes.length, 0)

    const cartEntries = Object.entries(quantities).filter(([number]) => dishesByNumber[number])
    const cartCount = cartEntries.reduce((total, [, quantity]) => total + quantity, 0)
    const cartTotalInCents = cartEntries.reduce((total, [number, quantity]) => total + dishesByNumber[number].priceInCents * quantity, 0)

    // New search or filter: back to the first result if the page is below it, or it would stay under the search bar
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        // Where the search bar starts to stick: below the menus, minus its sticky `top` (the navbar)
        const resultsTop = menusRef.current.getBoundingClientRect().bottom + window.scrollY - parseFloat(getComputedStyle(toolbarRef.current).top)
        if (window.scrollY > resultsTop) window.scrollTo({ top: resultsTop })
    }, [search, onlyVegan, onlySpicy])

    const closeDetail = useCallback(() => setSelected(null), [])
    const clearFilters = () => {
        setSearch('')
        setOnlyVegan(false)
        setOnlySpicy(false)
    }

    return (
        <>
            <div className='carta'>
                <header className='carta-hero'>
                    <div className='carta-hero-texts'>
                        <p className='carta-kicker'>Asia Oriental Taste</p>
                        <h1>Nuestra carta</h1>
                        <p className='carta-intro'>Todos nuestros platos, del dim sum al teppan yaki, con su foto y su precio.</p>
                        <ul className='carta-stats'>
                            <li><b>{allDishes.length}</b>platos</li>
                            <li><b>{menuSections.length}</b>secciones</li>
                            <li><b>{veganDishesCount}</b>veganos</li>
                        </ul>
                        <div className='carta-actions'>
                            <button type='button' className='carta-button' onClick={() => scrollToSection(sectionIds[0], toolbarRef)} disabled={!sectionIds.length}>Ver los platos</button>
                            <Link to='/pedidos' className='carta-button outline'>Pedir online</Link>
                        </div>
                    </div>
                    <div className='carta-hero-photos' aria-hidden='true'>
                        {heroPhotoUrls.map((url, index) => <img key={url} src={url} alt='' className={`carta-hero-photo photo-${index + 1}`} />)}
                    </div>
                </header>

                <section className='carta-menus' ref={menusRef} aria-label='Menús y cartas'>
                    {[menus.day, menus.night].map((menu) => (
                        <a key={menu.pdf} className='carta-menu' href={menu.pdf} target='_blank' rel='noreferrer'>
                            <span className='carta-menu-name'>{menu.name.es}</span>
                            <span className='carta-menu-time'>{menu.time.es}</span>
                            <span className='carta-menu-price'>{menu.price}</span>
                            {menu.price2 && <small className='carta-menu-note'>{cleanPriceNote(menu.price2)}</small>}
                            <span className='carta-menu-link'>Ver carta</span>
                        </a>
                    ))}
                    {extraMenus.map((menu) => (
                        <a key={menu.pdf} className='carta-menu' href={menu.pdf} target='_blank' rel='noreferrer'>
                            <span className='carta-menu-name'>{menu.name}</span>
                            <span className='carta-menu-time'>{menu.time}</span>
                            <span className='carta-menu-link'>Ver carta</span>
                        </a>
                    ))}
                </section>

                <div className='carta-toolbar' ref={toolbarRef}>
                    <div className='carta-toolbar-row'>
                        <div className='carta-search'>
                            <input type='search' value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Busca un plato' aria-label='Buscar plato' />
                        </div>
                        <button type='button' className={onlyVegan ? 'carta-filter vegan selected' : 'carta-filter vegan'} aria-pressed={onlyVegan} onClick={() => setOnlyVegan(!onlyVegan)}>Vegano</button>
                        <button type='button' className={onlySpicy ? 'carta-filter spicy selected' : 'carta-filter spicy'} aria-pressed={onlySpicy} onClick={() => setOnlySpicy(!onlySpicy)}>Picante</button>
                    </div>
                    <nav className='carta-chips' ref={chipsRef} aria-label='Secciones de la carta'>
                        {sections.map((section) => {
                            const thumbnail = getSectionThumbnail(section)
                            return (
                                <button type='button' key={section.id} data-section={section.id} className={section.id === activeId ? 'selected' : ''} onClick={() => scrollToSection(section.id, toolbarRef)}>
                                    {thumbnail ? <img src={thumbnail} alt='' /> : <span className='carta-chip-dot' />}
                                    {section.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <main className='carta-content'>
                    {shownDishesCount !== allDishes.length && !!sections.length && (
                        <p className='carta-results'>
                            {shownDishesCount} {shownDishesCount === 1 ? 'plato' : 'platos'}
                            <button type='button' onClick={clearFilters}>Ver todos</button>
                        </p>
                    )}
                    {!sections.length && (
                        <div className='carta-empty'>
                            <p>No hay platos que coincidan{search ? ` con «${search}»` : ''}.</p>
                            <button type='button' className='carta-button outline' onClick={clearFilters}>Ver toda la carta</button>
                        </div>
                    )}
                    {sections.map((section) => (
                        <section key={section.id} id={`seccion-${section.id}`} className='carta-section'>
                            <header className='carta-section-header'>
                                <h2>{section.name}</h2>
                                <span>
                                    {section.note && `${cleanSectionNote(section.note)} · `}
                                    {section.dishes.length} {section.dishes.length === 1 ? 'plato' : 'platos'}
                                </span>
                            </header>
                            <div className='carta-grid'>
                                {section.dishes.map((dish) => (
                                    <MenuDishCard key={dish.number} dish={dish} quantity={quantities[dish.number] ?? 0} onOpen={() => setSelected({ dish, sectionName: section.name })} />
                                ))}
                            </div>
                        </section>
                    ))}
                    <p className='carta-allergens'>Si tienes alguna alergia o intolerancia, avísanos antes de pedir.</p>
                </main>
            </div>

            {cartCount > 0 && !selected && (
                <Link to='/pedidos' className='carta-cart-bar'>
                    <span className='carta-cart-count'>{cartCount}</span>
                    <span>Ver mi pedido</span>
                    <span className='carta-cart-price'>{formatPrice(cartTotalInCents)}</span>
                </Link>
            )}

            {selected && (
                <DishDetail
                    dish={selected.dish}
                    sectionName={selected.sectionName}
                    quantity={quantities[selected.dish.number] ?? 0}
                    onChangeQuantity={(change) => setQuantities((current) => updateQuantities(current, selected.dish.number, change))}
                    onClose={closeDetail}
                />
            )}
            <Footer />
        </>
    )
}

export default MenuTotal
