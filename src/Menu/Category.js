import React from 'react'

const Category = ({ name, children }) => {
  return (
    <div className='category'>
      <div className='title'>
        <div className='decoration' />
        <div className='name'>{name}</div>
        <div className='decoration' />
      </div>
      <div className='container'>
        {children}
      </div>
    </div>
  )
}

export default Category