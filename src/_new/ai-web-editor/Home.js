import React, { useEffect, useState } from 'react'
import { useEditor } from './EditorContext'
import Icon from './Icon'
import Versions from './Versions'
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

// Where you are (and which version), what you can do with it and its latest requests; reloaded every time the panel
// opens. On an older version, editing and promoting give way to going back to it, since both act on the newest
const Home = ({ open, phase, onEdit, onPromote, onRestore, onDesigns, onOpenRequest, onHistory, onChanges }) => {
    const { ref, status, oldVersion } = useEditor()
    const [requests, setRequests] = useState(null)
    const onMain = ref === mainBranch
    const siteText = onMain ? 'esta web' : 'este diseño'
    const phaseText = phase === 'ready' ? '' : getPhaseText(phase, status)
    const branchRequests = requests?.filter(({ branch }) => branch === ref)

    useEffect(() => {
        if (open) getRequests().then(setRequests, () => setRequests([]))
    }, [open])

    return (
        <div className='aiwe-home'>
            <div className='aiwe-where'>
                <span className='aiwe-where-label'>Estás en</span>
                <span className='aiwe-where-name'>{getSiteName(ref)}</span>
                {status && <span className='aiwe-where-host'>{toHost(status.url)}</span>}
                <Versions />
            </div>
            {oldVersion && (
                <p className='aiwe-card'>
                    Estás viendo una versión anterior. Quien entra en {toHost(status.url)} sigue viendo la versión actual.
                </p>
            )}
            {phaseText && (
                <p className='aiwe-progress' role='status'>
                    <span className='aiwe-spinner' />
                    {phaseText}
                </p>
            )}
            <div className='aiwe-actions'>
                {oldVersion ? (
                    <Action
                        icon='undo'
                        title='Volver a esta versión'
                        hint={`${onMain ? 'La web' : 'El diseño'} vuelve a ser como en esta versión, para todos`}
                        onClick={onRestore}
                    />
                ) : (
                    <Action
                        icon='edit'
                        title={onMain ? 'Editar esta web' : 'Editar este diseño'}
                        hint='Textos, fotos, precios, menús, colores...'
                        onClick={() => onEdit('edit')}
                    />
                )}
                <Action icon='plus' title='Crear un diseño nuevo' hint='Otra versión de la web, con su propia dirección' onClick={() => onEdit('new')} />
                {!onMain && !oldVersion && (
                    <Action icon='star' title='Usar este diseño como principal' hint='La web principal pasa a ser este diseño' onClick={onPromote} />
                )}
                {onChanges && <Action icon='list' title='Ver cambios' hint={`Lo que ha cambiado en ${siteText}`} onClick={onChanges} />}
                <Action icon='designs' title='Ver diseños' hint='Todas las versiones de la web' onClick={onDesigns} />
            </div>
            <section className='aiwe-latest'>
                <div className='aiwe-section-header'>
                    <h3 className='aiwe-section-title'>Tus peticiones</h3>
                    {branchRequests?.length > latestRequestsNumber && (
                        <button type='button' className='aiwe-link' onClick={onHistory}>Ver todas</button>
                    )}
                </div>
                {!branchRequests && <p className='aiwe-empty'>Cargando...</p>}
                {branchRequests?.length === 0 && <p className='aiwe-empty'>Todavía no hay peticiones en {siteText}.</p>}
                {branchRequests?.length > 0 && (
                    <ul className='aiwe-request-list'>
                        {branchRequests.slice(0, latestRequestsNumber).map((request) => (
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
