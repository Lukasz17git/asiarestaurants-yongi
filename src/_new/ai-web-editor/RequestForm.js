import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import Composer from './Composer'
import { RequireCode } from './AccessCode'
import { createRequest, getSiteName, mainBranch, toHost } from './api'

const getDestination = (type, ref, status) => {
    if (type === 'new') return 'Se creará otra versión de la web, con su propia dirección. La web que ya existe no cambia.'
    const host = status ? `, ${toHost(status.url)}` : ''
    if (ref === mainBranch) return `Se cambiará la web que estás viendo${host}.`
    return `Se cambiará ${getSiteName(ref)}${host}. La web principal no cambia.`
}

// type 'edit' changes this site, 'new' starts a design from it, with the name the client gives it
const RequestForm = ({ type, onSent }) => {
    const { code, ref, status } = useEditor()
    const [name, setName] = useState('')

    const send = async ({ text, images }) => {
        const { number } = await createRequest(code, { type, name, text, ref, page: window.location.pathname, images })
        onSent(number)
    }

    return (
        <RequireCode>
            <p className='aiwe-card'>{getDestination(type, ref, status)}</p>
            <Composer
                label={type === 'new' ? '¿Cómo quieres el diseño nuevo?' : '¿Qué quieres cambiar?'}
                placeholder={type === 'new'
                    ? 'Ejemplo: una versión más moderna, con fondo claro y las fotos de los platos más grandes'
                    : 'Ejemplo: en el menú del mediodía, cambiar el precio de 14,50 € a 15,90 €'}
                sendLabel='Enviar petición'
                onSend={send}
            >
                {type === 'new' && (
                    <label className='aiwe-field'>
                        <span className='aiwe-field-label'>Ponle un nombre a tu diseño</span>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder='Ejemplo: Carta de verano'
                            maxLength={60}
                            required
                        />
                    </label>
                )}
            </Composer>
        </RequireCode>
    )
}

export default RequestForm
