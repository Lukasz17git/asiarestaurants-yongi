import React, { useEffect, useState } from 'react'
import { useEditor } from './EditorContext'
import { getRequests, getSiteName, mainBranch } from './api'

// Noon keeps '2026-10-21' on the 21st in any time zone
const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

// An entry without `branch` belongs to its request's branch, or to main (entries from before `branch`)
const getEntryBranch = (entry, requests) => entry.branch ?? requests?.find(({ number }) => number === entry.issue)?.branch ?? mainBranch

const Entry = ({ entry, onOpenRequest }) => (
    <li className='aiwe-change'>
        <span className='aiwe-change-meta'>
            {formatDate(entry.date)}
            {entry.issue && (
                <> · <button type='button' className='aiwe-link' onClick={() => onOpenRequest(entry.issue)}>Petición #{entry.issue}</button></>
            )}
        </span>
        <h3 className='aiwe-change-title'>{entry.title}</h3>
        {entry.summary && <p className='aiwe-change-summary'>{entry.summary}</p>}
        <ul className='aiwe-change-items'>
            {entry.changes.map((change) => <li key={change.text}>{change.text}</li>)}
        </ul>
    </li>
)

// The `changes` entries of the site or design you're on, newest first
const Changes = ({ changes = [], onOpenRequest }) => {
    const { ref } = useEditor()
    const [requests, setRequests] = useState(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        getRequests().then(setRequests, () => null).finally(() => setLoaded(true))
    }, [])

    const entries = changes.filter((entry) => getEntryBranch(entry, requests) === ref)

    return (
        <div className='aiwe-home'>
            <section>
                <h3 className='aiwe-section-title'>Cambios de {ref === mainBranch ? 'la web principal' : getSiteName(ref)}</h3>
                {!loaded && <p className='aiwe-empty'>Cargando cambios...</p>}
                {loaded && !entries.length && <p className='aiwe-empty'>Todavía no hay cambios.</p>}
                {loaded && entries.length > 0 && (
                    <ul className='aiwe-changes'>
                        {entries.map((entry) => <Entry key={`${entry.date}-${entry.title}`} entry={entry} onOpenRequest={onOpenRequest} />)}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default Changes
