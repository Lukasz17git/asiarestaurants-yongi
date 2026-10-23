import React, { useState, useEffect, useRef } from 'react'

const BigRoulette = () => {
    const [image, setImage] = useState(0)
    const width = window.innerWidth

    const images = [
        ['image1', 'image7', 'image13'],
        ['image2', 'image8', 'image14'],
        ['image3', 'image9', 'image15'],
        ['image4', 'image10', 'image16'],
        ['image5', 'image11', 'image17'],
        ['image6', 'image12', 'image18']
    ]
    const img1 = useRef()
    const img2 = useRef()
    const img3 = useRef()
    const lastImage = useRef(image)

    useEffect(() => {
        if (lastImage.current !== image) {
            img1.current.className = images[lastImage.current][0]
            if (img2.current) img2.current.className = images[lastImage.current][1]
            if (img3.current) img3.current.className = images[lastImage.current][2]
            lastImage.current = image
        }
    })

    return (
        <div className='roulette'>
            <div className='wrapper'>
                <div className='container'>
                    <img ref={img1} className={images[0][0]} alt='restaurant' />
                    <div className={'image ' + images[image][0]} />
                </div>
                {width > 700 && <div className='container'>
                    <img ref={img2} className={images[0][1]} alt='restaurant' />
                    <div className={'image ' + images[image][1]} />
                </div>}
                {width > 1100 && <div className='container'>
                    <img ref={img3} className={images[0][2]} alt='restaurant' />
                    <div className={'image ' + images[image][2]} />
                </div>}
            </div>
            <div className='dots'>
                <div onClick={() => setImage(0)} className={image === 0 ? 'selected' : ''} />
                <div onClick={() => setImage(1)} className={image === 1 ? 'selected' : ''} />
                <div onClick={() => setImage(2)} className={image === 2 ? 'selected' : ''} />
                <div onClick={() => setImage(3)} className={image === 3 ? 'selected' : ''} />
                <div onClick={() => setImage(4)} className={image === 4 ? 'selected' : ''} />
                <div onClick={() => setImage(5)} className={image === 5 ? 'selected' : ''} />
            </div>
        </div>
    )
}

export default BigRoulette