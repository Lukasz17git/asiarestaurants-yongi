import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import { checkCode, saveCode } from './api'

// Asked once per browser: the code is checked by the server's 'access' action and saved in localStorage
const AccessCode = () => {
    const { setCode } = useEditor()
    const [value, setValue] = useState('')
    const [checking, setChecking] = useState(false)
    const [error, setError] = useState('')

    const submit = async (event) => {
        event.preventDefault()
        setChecking(true)
        setError('')
        try {
            await checkCode(value.trim())
            saveCode(value.trim())
            setCode(value.trim())
        } catch (checkError) {
            setError(checkError.message)
        } finally {
            setChecking(false)
        }
    }

    return (
        <form className='aiwe-access' onSubmit={submit}>
            <p className='aiwe-intro'>Para cambiar la web con IA, escribe tu código de acceso. Solo te lo pediremos una vez en este navegador.</p>
            <label className='aiwe-field'>
                <span className='aiwe-field-label'>Código de acceso</span>
                <input type='password' value={value} onChange={(event) => setValue(event.target.value)} autoComplete='current-password' autoFocus required />
            </label>
            {error && <p className='aiwe-error' role='alert'>{error}</p>}
            <button type='submit' className='aiwe-button' disabled={checking || !value.trim()}>{checking ? 'Comprobando...' : 'Entrar'}</button>
        </form>
    )
}

// Shows the access code form in place of `children` until there is a code
export const RequireCode = ({ children }) => {
    const { code } = useEditor()
    return code ? children : <AccessCode />
}

export default AccessCode
