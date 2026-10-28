import { useEffect } from 'react'
import './reveal.css'

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds `is-visible` to each [data-reveal] inside the page the first time it scrolls into view; reveal.scss animates it.
// One observer for the whole page and only opacity/transform change, so the browser animates it without layout work
export const useReveal = (pageRef) => {
    useEffect(() => {
        const elements = pageRef.current.querySelectorAll('[data-reveal]')
        const showAll = () => elements.forEach((element) => element.classList.add('is-visible'))
        if (prefersReducedMotion() || !('IntersectionObserver' in window)) return showAll()

        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
        }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

        elements.forEach((element) => observer.observe(element))
        return () => observer.disconnect()
    }, [pageRef])
}

// style={revealDelay(2)}: the third card of a row comes in a moment after the first
export const revealDelay = (index, stepInSeconds = 0.1) => ({ '--reveal-delay': `${index * stepInSeconds}s` })
