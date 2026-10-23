import React, { useState, useRef, useEffect } from 'react'

const Roulette = () => {
  const [image, setImage] = useState(0)
  const img1 = useRef()
  const lastImage = useRef(image)

  const images = [
    'image1',
    'image2',
    'image3',
    'image4'
  ]

  useEffect(() => {
    if (lastImage.current !== image) {
      img1.current.className = images[lastImage.current]
      lastImage.current = image
    }
  })

  return (
    <div className='roulette'>
      <div className='container'>
        <img ref={img1} className={images[0]} alt='restaurant' />
        <div className={'image ' + images[image]} />
      </div>
      <div className='dots'>
        <div onClick={() => setImage(0)} className={image === 0 ? 'selected' : ''} />
        <div onClick={() => setImage(1)} className={image === 1 ? 'selected' : ''} />
        <div onClick={() => setImage(2)} className={image === 2 ? 'selected' : ''} />
        <div onClick={() => setImage(3)} className={image === 3 ? 'selected' : ''} />
      </div>
    </div>
  )
}

export default Roulette