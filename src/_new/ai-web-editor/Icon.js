import React from 'react'

// 24x24 outline icons, drawn with currentColor
const paths = {
    sparkle: 'M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
    close: 'M6 6l12 12 M18 6L6 18',
    back: 'M15 5l-7 7 7 7',
    edit: 'M4 20h4L19 9l-4-4L4 16z M13 7l4 4',
    plus: 'M12 5v14 M5 12h14',
    star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
    list: 'M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01',
    designs: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    external: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
    history: 'M3.5 12a8.5 8.5 0 102.5-6 M3.5 3.5V8H8 M12 7.5V12l3 2',
    undo: 'M9 14L4 9l5-5 M4 9h10.5a5.5 5.5 0 010 11H11',
    chevron: 'M6 9l6 6 6-6',
}

const Icon = ({ name }) => (
    <svg className='aiwe-icon' viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'>
        <path d={paths[name]} />
    </svg>
)

export default Icon
