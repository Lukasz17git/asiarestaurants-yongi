import React from 'react'

const Dish = ({ dish }) => {
  const { name, photo } = dish
  return (
    <div className='dish-container'>
      <div className='dish-bg'>
        <div className='name'>{name}</div>
        <div className='photo'>
          <div className='gloss' />
          <img className={photo} alt={name} src={require(`../images/mealsNoBg/${photo}.webp`)} />
        </div>
      </div>
    </div>
  )
}

export default Dish