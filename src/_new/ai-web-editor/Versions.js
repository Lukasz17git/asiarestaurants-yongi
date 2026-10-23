import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import Icon from './Icon'
import { formatAgo, formatDateTime } from './api'
import { getPagePath, historyNumber } from './versionPath'

// This site's last 10 versions under its address. Each opens on the page you're on, at '/_history/3' of the site
// (the newest at the site's own pages), so visitors keep seeing the newest
const Versions = () => {
    const { status, versions, oldVersion } = useEditor()
    const [open, setOpen] = useState(false)
    if (!status || !versions?.length) return null

    const getHref = (version, index) => `${index === 0 ? status.url : version.url}${getPagePath()}`
    const viewedNumber = historyNumber ?? versions[0].number
    const oldDate = oldVersion?.date ? `, del ${formatDateTime(oldVersion.date)}` : ''

    return (
        <div className='aiwe-versions'>
            <button type='button' className='aiwe-versions-toggle' aria-expanded={open} onClick={() => setOpen(!open)}>
                <Icon name='history' />
                <span className='aiwe-versions-label'>{oldVersion ? `Versión anterior${oldDate}` : 'Versión actual'}</span>
                <span className='aiwe-versions-count'>{versions.length === 1 ? '1 versión' : `${versions.length} versiones`}</span>
                <Icon name='chevron' />
            </button>
            {open && (
                <ul className='aiwe-version-list'>
                    {versions.map((version, index) => {
                        const here = version.number === viewedNumber
                        return (
                            <li key={version.number}>
                                <a className={here ? 'aiwe-version current' : 'aiwe-version'} href={getHref(version, index)} aria-current={here ? 'page' : undefined}>
                                    <span className='aiwe-version-texts'>
                                        <span className='aiwe-version-title'>{version.title}</span>
                                        <span className='aiwe-version-meta'>
                                            {index === 0 && 'Actual · '}
                                            {formatDateTime(version.date)} · {formatAgo(version.date)}
                                        </span>
                                    </span>
                                    {here && <span className='aiwe-chip'>Estás aquí</span>}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default Versions
