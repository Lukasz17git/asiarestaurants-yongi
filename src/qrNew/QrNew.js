import React from 'react'
import qrData from './qrData'
import { Link } from 'react-router-dom'

const QrNew = () => {
   const language = 'es'
   const cartas = [qrData.new]
   const button = {
      es: 'Ver Carta',
      cat: ''
   }

   return (
      <div className='qr'>
         <div className='logo' >
            <Link to='/'>Ver página web</Link>
         </div>
         <div className='cartas'>
            {cartas.map((carta) => (
               <div key={carta[language]} className='carta'>
                  <div className='carta-bg'>
                     <div className='carta-title'>{carta[language]}</div>
                     <div className='carta-button'>
                        <a href={carta.pdf} target='blank'>
                           {button[language]}
                        </a>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         <div className='copy font3'>© 2022 Asia Restaurants</div>
      </div>
   )
}

export default QrNew