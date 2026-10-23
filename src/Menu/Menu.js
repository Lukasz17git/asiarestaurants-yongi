import React from 'react'

const Menu = ({ menu }) => {
  const language = 'es'
  const { name, description, button, time, pdf, price, price2 } = menu
  return (
    <div className='menu-wrapper'>
      <div className='menu-bg'>
        <div className='menu-title'>{name[language]}</div>
        {price && <div className='menu-price'>{price}{price2 && <pre className='menu-price2'>{price2}</pre>}</div>}
        <div>
          {time && <div className='menu-time'>{time[language]}</div>}

          <div className='menu-description'>{description[language]}</div>
        </div>
        {button && <div className='menu-button'>
          <a href={pdf} target='blank' >
            {button[language]}
          </a>
        </div>}
      </div>
    </div>
  )
}

export default Menu