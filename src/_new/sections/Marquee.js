import React from 'react'
import './sections.css'

const defaultWords = ['Sushi', 'Uramaki', 'Ramen', 'Gua Bao', 'Nigiri', 'Dim Sum', 'Poke Bowl', 'Tempura', 'Tartar', 'Fideos chinos', 'Hosomaki', 'Pato']

// Red band of words moving sideways; the list is written twice so the loop has no gap, the copy hidden to screen readers
const Marquee = ({ words = defaultWords }) => {
    return (
        <div className='marquee'>
            <div className='marquee-track'>
                <ul>{words.map((word) => <li key={word}>{word}</li>)}</ul>
                <ul aria-hidden='true'>{words.map((word) => <li key={word}>{word}</li>)}</ul>
            </div>
        </div>
    )
}

export default Marquee
