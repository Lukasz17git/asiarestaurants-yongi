import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { hoursText, instagramUrl, phoneText, phoneUrl } from './_new/sections/reservation'
import './css/Navbar.css'

// kanji: shown next to the name in the phone menu
const links = [
    { to: '/', name: { es: 'HOME', cat: 'HOME' }, kanji: '家' },
    { to: '/menu', name: { es: 'CARTA', cat: 'CARTA' }, kanji: '品書' },
    { to: '/reservar', name: { es: 'RESERVAR', cat: 'RESERVAR' }, kanji: '予約' },
    { to: '/pedidos', name: { es: 'PEDIR ONLINE', cat: 'DEMANAR ONLINE' }, kanji: '持ち帰り', className: 'link-order' },
    { to: '/restaurant', name: { es: 'RESTAURANTES', cat: 'RESTAURANTS' }, kanji: '店' },
]

const Navbar = () => {
    const language = 'es'
    const path = useLocation().pathname

    const [menu, setMenu] = useState(false)
    const hideMenu = () => setMenu(false)

    // Locks the page's scroll while the phone menu is open
    useEffect(() => {
        if (!menu) return
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [menu])

    return (
        <div className={menu ? 'navbar is-open' : 'navbar'}>
            <div className='bg-opacity' />
            <Link to='/'><div className='main-logo' ><span>home</span></div></Link>
            <div className='menu-icon' onClick={() => setMenu(!menu)} />
            <div className='menu font4'>
                {links.map(({ to, name, kanji, className }, index) => (
                    <div key={to} className={['link', className, path === to && 'selected'].filter(Boolean).join(' ')} style={{ '--i': index }} onClick={hideMenu}>
                        <Link to={to}>
                            {name[language]}
                            <span className='link-kanji' aria-hidden='true'>{kanji}</span>
                            <div className='underline' />
                        </Link>
                    </div>
                ))}
                <div className='menu-info'>
                    <span>{hoursText}</span>
                    <a href={phoneUrl}>{phoneText}</a>
                    <a href={instagramUrl} target='_blank' rel='noreferrer'>@ioyiramen</a>
                </div>
            </div>
        </div>
    )
}

export default Navbar
