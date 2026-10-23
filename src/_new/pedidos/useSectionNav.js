import { useEffect, useState } from 'react'

export const getSectionElement = (id) => document.getElementById(`seccion-${id}`)

// Highlights the chip of the last section whose top has passed under the search bar, and scrolls the chip into view
export const useActiveSection = (sectionIds, toolbarRef, chipsRef) => {
    const [activeId, setActiveId] = useState(sectionIds[0])

    useEffect(() => {
        let frame = null
        let idleTimer = null

        const getActiveId = () => {
            const toolbarBottom = toolbarRef.current.getBoundingClientRect().bottom
            const passedIds = sectionIds.filter((id) => getSectionElement(id)?.getBoundingClientRect().top <= toolbarBottom + 8)
            return passedIds[passedIds.length - 1] ?? sectionIds[0]
        }
        const scrollChipIntoView = () => {
            const chips = chipsRef.current
            const chip = chips?.querySelector(`[data-section='${getActiveId()}']`)
            if (!chip) return
            const chipLeft = chip.getBoundingClientRect().left - chips.getBoundingClientRect().left + chips.scrollLeft
            chips.scrollTo({ left: chipLeft - 16, behavior: 'smooth' })
        }
        const onScroll = () => {
            frame ??= requestAnimationFrame(() => {
                frame = null
                setActiveId(getActiveId())
            })
            // Waits until the page stops: in Chrome a smooth scroll of the chip row stops the page's smooth scroll
            clearTimeout(idleTimer)
            idleTimer = setTimeout(scrollChipIntoView, 150)
        }

        setActiveId(getActiveId())
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (frame) cancelAnimationFrame(frame)
            clearTimeout(idleTimer)
        }
    }, [sectionIds, toolbarRef, chipsRef])

    return activeId
}

// Puts the section's title right under the search bar, which is sticky and so not counted by scrollIntoView.
// Measures from where the bar ends once stuck (its `top` + height): near the top of the page it's still lower.
// Jumps of more than 3 screens are instant: a smooth one over the whole menu takes about 3s
export const scrollToSection = (id, toolbarRef) => {
    const toolbar = toolbarRef.current
    const stuckToolbarBottom = parseFloat(getComputedStyle(toolbar).top) + toolbar.offsetHeight
    const distance = getSectionElement(id).getBoundingClientRect().top - stuckToolbarBottom
    const behavior = Math.abs(distance) > window.innerHeight * 3 ? 'auto' : 'smooth'
    window.scrollTo({ top: window.scrollY + distance, behavior })
}
