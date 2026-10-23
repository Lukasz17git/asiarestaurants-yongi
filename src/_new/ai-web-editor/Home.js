import React, { useEffect, useState } from 'react'
import { useEditor } from './EditorContext'
import Icon from './Icon'
import Versions from './Versions'
import { RequestRow } from './History'
import { getPhaseText } from './AiWebEditor'
import { formatAgo, getDesigns, getRequests, getSiteName, mainBranch, toHost } from './api'

const latestRequestsNumber = 3
const latestDesignsNumber = 4

// The 4 last changed, the main web included; one without updatedAt goes last
const getLatestDesigns = (designs) => [...designs]
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, latestDesignsNumber)

const Action = ({ icon, title, hint, onClick }) => (
    <button type='button' className='aiwe-action' onClick={onClick}>
        <span className='aiwe-action-icon'><Icon name={icon} /></span>
        <span className='aiwe-action-texts'>
            <span className='aiwe-action-title'>{title}</span>
            <span className='aiwe-action-hint'>{hint}</span>
        </span>
    </button>
)

// Where you are (and which version), what you can do with it, the latest designs and its latest requests; reloaded
// every time the panel opens. On an older version, editing and promoting give way to going back to it, since both act
// on the newest
const Home = ({ open, phase, onEdit, onPromote, onRestore, onDesigns, onOpenRequest, onHistory, onChanges }) => {
    const { ref, status, oldVersion } = useEditor()
    const [requests, setRequests] = useState(null)
    const [designs, setDesigns] = useState(null)
    const onMain = ref === mainBranch
    const siteText = onMain ? 'esta web' : 'este diseño'
    const phaseText = phase === 'ready' ? '' : getPhaseText(phase, status)
    const branchRequests = requests?.filter(({ branch }) => branch === ref)

    useEffect(() => {
        if (!open) return
        getRequests().then(setRequests, () => setRequests([]))
        getDesigns().then(setDesigns, () => setDesigns([]))
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
            </div>
            <section className='aiwe-latest'>
                <div className='aiwe-section-header'>
                    <h3 className='aiwe-section-title'>Diseños</h3>
                    <button type='button' className='aiwe-link' onClick={onDesigns}>Ver todos</button>
                </div>
                {!designs && <p className='aiwe-empty'>Cargando...</p>}
                {designs?.length > 0 && (
                    <ul className='aiwe-request-list'>
                        {getLatestDesigns(designs).map((design) => (
                            <li key={design.branch}>
                                <a className='aiwe-request-row aiwe-design-row' href={design.url + window.location.pathname}>
                                    <span className='aiwe-request-texts'>
                                        <span className='aiwe-request-title'>{design.title ?? getSiteName(design.branch)}</span>
                                        <span className='aiwe-request-meta'>
                                            {toHost(design.url)}
                                            {design.updatedAt && ` · ${formatAgo(design.updatedAt)}`}
                                        </span>
                                    </span>
                                    {design.branch === ref && <span className='aiwe-chip'>Estás aquí</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
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
