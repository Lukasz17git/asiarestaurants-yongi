import React, { useCallback, useEffect, useState } from 'react'
import Composer from './Composer'
import Icon from './Icon'
import ImagePreview from './ImagePreview'
import { useEditor } from './EditorContext'
import { RequireCode } from './AccessCode'
import { formatAgo, getSiteName, getThread, replyToRequest } from './api'
import { getPagePath } from './versionPath'

// Only while the panel is open and the tab is visible
const pollMs = 6000
// A message this recent with no Claude run yet means the run is about to start
const startingMs = 90000

const urlPattern = /(https?:\/\/[^\s)]+)/g

// Links in a line of text; '#' headings and '**' from GitHub markdown are dropped
const Line = ({ text }) => text
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .split(urlPattern)
    .map((part, index) => (index % 2 ? <a key={index} href={part} target='_blank' rel='noopener noreferrer'>{part}</a> : part))

// Paragraphs, and '- ' lines as a list
const MessageText = ({ text }) => text.split(/\n{2,}/).map((block, blockIndex) => {
    const lines = block.split('\n')
    if (lines.every((line) => /^\s*[-*] /.test(line))) return (
        <ul key={blockIndex}>
            {lines.map((line, index) => <li key={index}><Line text={line.replace(/^\s*[-*] /, '')} /></li>)}
        </ul>
    )
    return (
        <p key={blockIndex}>
            {lines.map((line, index) => <React.Fragment key={index}>{index > 0 && <br />}<Line text={line} /></React.Fragment>)}
        </p>
    )
})

// Reference images are deleted after 7 days, so a missing one shows as a note
const MessageImage = ({ image, onOpen }) => {
    const [missing, setMissing] = useState(false)
    if (missing) return <span className='aiwe-message-image-missing'>Imagen borrada</span>
    return (
        <button type='button' onClick={onOpen} aria-label={`Ver ${image.name}`}>
            <img src={image.url} alt={image.name} loading='lazy' onError={() => setMissing(true)} />
        </button>
    )
}

const Message = ({ message, onOpenImage }) => (
    <li className={`aiwe-message ${message.from}`}>
        <span className='aiwe-message-meta'>{message.from === 'ai' ? 'IA' : 'Tú'} · {formatAgo(message.createdAt)}</span>
        <div className='aiwe-bubble'>
            {message.text && <MessageText text={message.text} />}
            {message.images.length > 0 && (
                <div className='aiwe-message-images'>
                    {message.images.map((image, index) => (
                        <MessageImage key={image.url} image={image} onOpen={() => onOpenImage(message.images, index)} />
                    ))}
                </div>
            )}
        </div>
    </li>
)

const getProgress = (thread) => {
    if (thread.working) return 'La IA está trabajando en tu petición...'
    const last = thread.messages[thread.messages.length - 1]
    if (last.from === 'client' && Date.now() - new Date(last.createdAt).getTime() < startingMs) return 'Enviado. La IA empezará en unos segundos...'
    return ''
}

// In place of the reply box, with a link to the same page where replying works
const ReplyElsewhere = ({ text, href, label }) => (
    <div className='aiwe-card aiwe-reply-elsewhere'>
        <p>{text}</p>
        <a className='aiwe-button secondary small' href={href}>
            {label}
            <Icon name='external' />
        </a>
    </div>
)

// The request's messages, refreshed every 6s while `active`, and a box to reply (a reply starts Claude again).
// The box shows only on the request's design and its newest version, where the reply's changes will show
const Thread = ({ number, active }) => {
    const { code, ref, status, oldVersion } = useEditor()
    const [thread, setThread] = useState(null)
    const [error, setError] = useState('')
    const [preview, setPreview] = useState({ images: [], index: null })

    const load = useCallback(() => getThread(number).then(setThread, (loadError) => setError(loadError.message)), [number])

    useEffect(() => {
        let mounted = true
        let loading = false
        let timer
        const poll = async () => {
            clearTimeout(timer)
            if (!active || document.hidden || loading) return
            loading = true
            await load()
            loading = false
            if (mounted) timer = setTimeout(poll, pollMs)
        }
        poll()
        document.addEventListener('visibilitychange', poll)
        return () => {
            mounted = false
            clearTimeout(timer)
            document.removeEventListener('visibilitychange', poll)
        }
    }, [load, active])

    if (!thread) return error ? <p className='aiwe-error'>{error}</p> : <p className='aiwe-empty'>Cargando la conversación...</p>

    const progress = getProgress(thread)
    const reply = async ({ text, references, assets }) => {
        await replyToRequest(code, number, { text, page: getPagePath(), references, assets })
        await load()
    }

    return (
        <div className='aiwe-thread'>
            <div className='aiwe-thread-info'>
                <span className='aiwe-chip'>{getSiteName(thread.branch)}</span>
                <a href={thread.url} target='_blank' rel='noopener noreferrer'>Abrir esta web</a>
            </div>
            <ul className='aiwe-messages'>
                {thread.messages.map((message) => (
                    <Message key={message.id} message={message} onOpenImage={(images, index) => setPreview({ images, index })} />
                ))}
            </ul>
            {progress && (
                <p className='aiwe-progress' role='status'>
                    <span className='aiwe-spinner' />
                    {progress}
                </p>
            )}
            {thread.branch !== ref && (
                <ReplyElsewhere
                    text={`Esta petición es de ${getSiteName(thread.branch)}. Para seguir con ella, ábrela desde allí.`}
                    href={thread.url + getPagePath()}
                    label={`Abrir ${getSiteName(thread.branch)}`}
                />
            )}
            {thread.branch === ref && oldVersion && (
                <ReplyElsewhere
                    text='Estás viendo una versión anterior. Para seguir con esta petición, abre la versión actual.'
                    href={status.url + getPagePath()}
                    label='Abrir la versión actual'
                />
            )}
            {thread.branch === ref && !oldVersion && (
                <RequireCode>
                    <Composer
                        compact
                        placeholder='Escribe aquí para corregir algo, deshacerlo o pedir más cambios en esta petición'
                        sendLabel='Responder'
                        onSend={reply}
                    />
                </RequireCode>
            )}
            <ImagePreview images={preview.images} index={preview.index} onIndexChange={(index) => setPreview((current) => ({ ...current, index }))} />
        </div>
    )
}

export default Thread
