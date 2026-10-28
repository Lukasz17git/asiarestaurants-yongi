import React from 'react'

const Dish = ({ dish, index }) => {
  const { name, photo } = dish
  const maxDelayedDishesNumber = 12
  const animationDelay = `${Math.min(index, maxDelayedDishesNumber) * 0.05}s`

  return (
    <div className='dish-container' style={{ animationDelay }}>
      <div className='dish-bg'>
        <div className='photo'>
          <img className={photo} alt={name} src={require(`../images/mealsNoBg/${photo}.webp`)} loading='lazy' />
        </div>
        <div className='name'>{name}</div>
      </div>
    </div>
  )
}

export default Dish
