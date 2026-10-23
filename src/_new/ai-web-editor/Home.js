import React, { useEffect, useState } from 'react'
import { useEditor } from './EditorContext'
import Icon from './Icon'
import { RequestRow } from './History'
import { getPhaseText } from './AiWebEditor'
import { getRequests, getSiteName, mainBranch, toHost } from './api'

const latestRequestsNumber = 3

const Action = ({ icon, title, hint, onClick }) => (
    <button type='button' className='aiwe-action' onClick={onClick}>
        <span className='aiwe-action-icon'><Icon name={icon} /></span>
        <span className='aiwe-action-texts'>
            <span className='aiwe-action-title'>{title}</span>
            <span className='aiwe-action-hint'>{hint}</span>
        </span>
    </button>
)

// Where you are, what you can do with it and your latest requests; reloaded every time the panel opens
const Home = ({ open, phase, onEdit, onPromote, onDesigns, onOpenRequest, onHistory, onChanges }) => {
    const { ref, status } = useEditor()
    const [requests, setRequests] = useState(null)
    const onMain = ref === mainBranch
    const phaseText = phase === 'ready' ? '' : getPhaseText(phase, status)

    useEffect(() => {
        if (open) getRequests().then(setRequests, () => setRequests([]))
    }, [open])

    return (
        <div className='aiwe-home'>
            <div className='aiwe-where'>
                <span className='aiwe-where-label'>Estás en</span>
                <span className='aiwe-where-name'>{getSiteName(ref)}</span>
                {status && <span className='aiwe-where-host'>{toHost(status.url)}</span>}
            </div>
            {phaseText && (
                <p className='aiwe-progress' role='status'>
                    <span className='aiwe-spinner' />
                    {phaseText}
                </p>
            )}
            <div className='aiwe-actions'>
                <Action
                    icon='edit'
                    title={onMain ? 'Editar esta web' : 'Editar este diseño'}
                    hint='Textos, fotos, precios, menús, colores...'
                    onClick={() => onEdit('edit')}
                />
                <Action icon='plus' title='Crear un diseño nuevo' hint='Otra versión de la web, con su propia dirección' onClick={() => onEdit('new')} />
                {!onMain && (
                    <Action icon='star' title='Usar este diseño como principal' hint='La web principal pasa a ser este diseño' onClick={onPromote} />
                )}
                {onChanges && (
                    <Action
                        icon='list'
                        title='Ver cambios'
                        hint={`Lo que ha cambiado en ${onMain ? 'esta web' : 'este diseño'} y sus versiones anteriores`}
                        onClick={onChanges}
                    />
                )}
                <Action icon='designs' title='Ver diseños' hint='Todas las versiones de la web' onClick={onDesigns} />
            </div>
            <section className='aiwe-latest'>
                <div className='aiwe-section-header'>
                    <h3 className='aiwe-section-title'>Tus peticiones</h3>
                    {requests?.length > latestRequestsNumber && (
                        <button type='button' className='aiwe-link' onClick={onHistory}>Ver todas</button>
                    )}
                </div>
                {!requests && <p className='aiwe-empty'>Cargando...</p>}
                {requests?.length === 0 && <p className='aiwe-empty'>Todavía no hay peticiones.</p>}
                {requests?.length > 0 && (
                    <ul className='aiwe-request-list'>
                        {requests.slice(0, latestRequestsNumber).map((request) => (
                            <li key={request.number}>
                                <button type='button' className='aiwe-request-row' onClick={() => onOpenRequest(request.number)}>
                                    <RequestRow request={request} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default Home
