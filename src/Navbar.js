import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './css/Navbar.css'

const Navbar = () => {
    const language = 'es'
    const path = useLocation().pathname

    const homeName = { es: 'HOME', cat: 'HOME' }
    const menuName = { es: 'MENUS', cat: 'MENUS' }
    const restaurantsName = { es: 'RESTAURANTES', cat: 'RESTAURANTES' }
    const pedidosName = { es: 'PEDIR ONLINE', cat: 'DEMANAR ONLINE' }

    const [menu, setMenu] = useState(false)
    const style = { transform: 'translateX(0%)' }
    const hideMenu = () => setMenu(false)

    return (
        <div className='navbar'>
            <div className='bg-opacity' />
            <Link to='/'><div className='main-logo' ><span>home</span></div></Link>
            <div className='menu-icon' onClick={() => setMenu(!menu)} />
            <div className='menu font4' style={menu ? style : undefined}>
                <div className={path === '/' ? 'link selected' : 'link'} onClick={hideMenu}>
                    <Link to='/'>
                        {homeName[language]}
                        <div className='underline' />
                    </Link>
                </div>
                <div className={path === '/menu' ? 'link selected' : 'link'} onClick={hideMenu}>
                    <Link to='/menu'>
                        {menuName[language]}
                        <div className='underline' />
                    </Link>
                </div>
                <div className={path === '/restaurant' ? 'link selected' : 'link'} onClick={hideMenu}>
                    <Link to='/restaurant'>
                        {restaurantsName[language]}
                        <div className='underline' />
                    </Link>
                </div>
                <div className={path === '/pedidos' ? 'link selected' : 'link'} onClick={hideMenu}>
                    <Link to='/pedidos'>
                        {pedidosName[language]}
                        <div className='underline' />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar