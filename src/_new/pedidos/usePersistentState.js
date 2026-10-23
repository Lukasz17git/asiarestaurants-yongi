import { useEffect, useState } from 'react'

const readValue = (key, initialValue) => {
    try {
        const savedValue = localStorage.getItem(key)
        return savedValue ? { ...initialValue, ...JSON.parse(savedValue) } : initialValue
    } catch {
        return initialValue
    }
}

// useState for an object kept in localStorage, so a reload or a trip to WhatsApp keeps the cart and the details
export const usePersistentState = (key, initialValue) => {
    const [value, setValue] = useState(() => readValue(key, initialValue))

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // Private mode or blocked storage: the page still works, it just forgets on reload
        }
    }, [key, value])

    return [value, setValue]
}
