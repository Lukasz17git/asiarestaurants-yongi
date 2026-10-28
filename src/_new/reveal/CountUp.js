import React, { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './useReveal'

const durationInMs = 1600

const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3)

const canAnimate = () => !prefersReducedMotion() && 'IntersectionObserver' in window

// Counts from 0 up to `to` the first time it scrolls into view
const CountUp = ({ to, prefix = '', suffix = '' }) => {
    const [value, setValue] = useState(() => canAnimate() ? 0 : to)
    const elementRef = useRef(null)

    useEffect(() => {
        if (!canAnimate()) return

        let frame = null
        const count = () => {
            const startTimestamp = performance.now()
            const step = (now) => {
                const progress = Math.min((now - startTimestamp) / durationInMs, 1)
                setValue(Math.round(easeOutCubic(progress) * to))
                if (progress < 1) frame = requestAnimationFrame(step)
            }
            frame = requestAnimationFrame(step)
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            observer.disconnect()
            count()
        }, { threshold: 0.6 })

        observer.observe(elementRef.current)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [to])

    return (
        <span ref={elementRef}>{prefix}{value}{suffix}</span>
    )
}

export default CountUp
