import React from 'react'
import { Link } from 'react-router-dom'
import gold from '../generateGold'
// import { deliveryLink } from './delivery-link'

const Front = () => {
  return (
    <div className='front'>
      <div className='title'>{gold('Asia Oriental Taste')}</div>
      <div className='description'>Una manera única de saborear Platos Orientales</div>
      <div className='wrapper'>

        {/* <div className='section'>
          <a href={deliveryLink} >
            <div className='name name-red'>
              Pide online ahora!
            </div>
            <div className='arrow arrow-red' />
          </a>
        </div> */}

        <div className='section'>
          <Link to='/menu'>
            <div className='name'>Menús</div>
            <div className='arrow' />
          </Link>
        </div>
      </div>
      <div className='fan2' />
    </div>
  )
}

export default Front
