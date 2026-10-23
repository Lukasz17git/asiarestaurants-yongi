import React, { useEffect, useState } from 'react'
import { useEditor } from './EditorContext'
import { formatAgo, getRequests, getSiteName, mainBranch } from './api'

export const getRequestStatus = (request) => {
    if (request.working) return { id: 'working', label: 'IA trabajando' }
    if (request.closed) return { id: 'closed', label: 'Cerrada' }
    if (request.comments > 0) return { id: 'answered', label: 'Respondida' }
    return { id: 'sent', label: 'Enviada' }
}

export const RequestRow = ({ request }) => {
    const status = getRequestStatus(request)
    return (
        <>
            <span className={`aiwe-status-dot ${status.id}`} aria-hidden='true' />
            <span className='aiwe-request-texts'>
                <span className='aiwe-request-title'>{request.title}</span>
                <span className='aiwe-request-meta'>#{request.number} · {getSiteName(request.branch)} · {formatAgo(request.createdAt)} · {status.label}</span>
            </span>
        </>
    )
}

// The requests of the site or design you're on, from the last 100 of every design
const History = ({ onOpen }) => {
    const { ref } = useEditor()
    const [requests, setRequests] = useState(null)
    const [error, setError] = useState('')
    const branchRequests = requests?.filter(({ branch }) => branch === ref)

    useEffect(() => {
        getRequests().then(setRequests, (loadError) => setError(loadError.message))
    }, [])

    if (error) return <p className='aiwe-error'>{error}</p>
    if (!branchRequests) return <p className='aiwe-empty'>Cargando peticiones...</p>
    if (branchRequests.length === 0) return <p className='aiwe-empty'>Todavía no hay peticiones en {ref === mainBranch ? 'esta web' : 'este diseño'}.</p>
    return (
        <ul className='aiwe-request-list'>
            {branchRequests.map((request) => (
                <li key={request.number}>
                    <button type='button' className='aiwe-request-row' onClick={() => onOpen(request.number)}>
                        <RequestRow request={request} />
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default History
