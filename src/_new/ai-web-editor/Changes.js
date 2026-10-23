import React, { useEffect, useState } from 'react'
import { useEditor } from './EditorContext'
import { getRequests, getSiteName, mainBranch } from './api'

// Noon keeps '2026-10-21' on the 21st in any time zone
const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

const formatDateTime = (date) => new Date(date).toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

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

// Versions built from this branch's earlier commits ({ sha, date, title, url }); [] when the file is missing
const Versions = ({ versionsUrl }) => {
    const [versions, setVersions] = useState(null)

    useEffect(() => {
        fetch(versionsUrl, { cache: 'no-store' })
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => [])
            .then(setVersions)
    }, [versionsUrl])

    if (!versions) return <p className='aiwe-empty'>Cargando versiones...</p>
    if (!versions.length) return <p className='aiwe-empty'>Todavía no hay versiones guardadas. Aparecerán después de los próximos cambios.</p>
    return (
        <ul className='aiwe-design-list'>
            {versions.map((version) => (
                <li key={version.sha} className='aiwe-design'>
                    <span className='aiwe-design-texts'>
                        <span className='aiwe-design-name'>{version.title}</span>
                        <span className='aiwe-design-meta'>{formatDateTime(version.date)}</span>
                    </span>
                    <a className='aiwe-button secondary small' href={version.url} target='_blank' rel='noopener noreferrer'>Abrir</a>
                </li>
            ))}
        </ul>
    )
}

// The `changes` entries of the site or design you're on, newest first, and its previous versions
const Changes = ({ changes = [], versionsUrl, onOpenRequest }) => {
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
            {versionsUrl && (
                <section>
                    <h3 className='aiwe-section-title'>Versiones anteriores</h3>
                    <p className='aiwe-intro aiwe-section-intro'>Las últimas versiones publicadas antes de la actual. Cada una se abre tal como era, sin cambiar esta web.</p>
                    <Versions versionsUrl={versionsUrl} />
                </section>
            )}
        </div>
    )
}

export default Changes
