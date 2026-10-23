// Calls to the editor's Vercel function (server/, served at api/ai-editor.js) and the shared helpers
let apiUrl = '/api/ai-editor'

export const setApiUrl = (url) => {
    apiUrl = url
}

export const mainBranch = 'main'

// 'main' -> 'Web principal', 'diseno-12' (made by the editor) -> 'Diseño 12', 'lucas-v1' -> 'Diseño lucas-v1'
export const getSiteName = (branch) => {
    if (branch === mainBranch) return 'Web principal'
    return `Diseño ${branch.match(/^diseno-(\d+)$/)?.[1] ?? branch}`
}

export const toHost = (url) => url.replace(/^https?:\/\//, '')

/*
 * Access code
 */

const codeKey = 'ai-web-editor-code'

export const getSavedCode = () => {
    try {
        return localStorage.getItem(codeKey) ?? ''
    } catch {
        return ''
    }
}

export const saveCode = (code) => {
    try {
        localStorage.setItem(codeKey, code)
    } catch {}
}

export const forgetCode = () => {
    try {
        localStorage.removeItem(codeKey)
    } catch {}
}

/*
 * Function calls
 */

// Throws the function's own Spanish message ({ error }) with its status, so a 401 can ask for the code again
const call = async (action, { method = 'GET', code, body, params } = {}) => {
    const res = await fetch(`${apiUrl}?${new URLSearchParams({ action, ...params })}`, {
        method,
        cache: 'no-store',
        headers: { ...(body && { 'Content-Type': 'application/json' }), ...(code && { 'x-editor-code': code }) },
        body: body && JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw Object.assign(new Error(data.error ?? 'No se ha podido conectar. Prueba de nuevo.'), { status: res.status })
    return data
}

export const getStatus = () => call('status')

export const getRequests = () => call('requests')

export const getThread = (number) => call('request', { params: { number } })

export const getDesigns = () => call('designs')

export const checkCode = (code) => call('access', { method: 'POST', code })

// type: 'edit' (this site), 'new' (a new design) or 'promote' (this design becomes the main web)
export const createRequest = (code, body) => call('requests', { method: 'POST', code, body })

export const replyToRequest = (code, number, body) => call('request', { method: 'POST', code, body, params: { number } })

// 'Carta de verano' -> 'carta-de-verano' (accents dropped: 'Menú' -> 'menu')
const toFileName = (name) => name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'imagen'

// Uploads one compressed image under the name the client gave it, in this repo's folder of the shared Blob store
// ('asiarestaurants-yongi/peticiones'); Blob adds a random suffix
const uploadImage = async (code, folder, { file, name }) => {
    const { upload } = await import('@vercel/blob/client')
    const extension = file.type.split('/')[1] ?? 'webp'
    const { url } = await upload(`${folder}/${toFileName(name)}.${extension}`, file, {
        access: 'public',
        handleUploadUrl: `${apiUrl}?action=upload`,
        clientPayload: code,
    })
    return { name, url }
}

// One at a time, calling onProgress(1..n) before each
export const uploadImages = async (code, folder, images, onProgress) => {
    const uploaded = []
    for (const [index, image] of images.entries()) {
        onProgress(index + 1)
        const result = await uploadImage(code, folder, image).catch(() => {
            throw new Error(`No se ha podido subir «${image.name}». Prueba de nuevo.`)
        })
        uploaded.push(result)
    }
    return uploaded
}

/*
 * Dates
 */

const relativeTime = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const timeUnits = [['day', 86400], ['hour', 3600], ['minute', 60]]

// '2026-10-22T14:20:20Z' -> 'hace 5 minutos'; 'ahora' under a minute
export const formatAgo = (date) => {
    const seconds = (new Date(date).getTime() - Date.now()) / 1000
    const [unit, unitSeconds] = timeUnits.find(([, size]) => Math.abs(seconds) >= size) ?? []
    if (!unit) return 'ahora'
    return relativeTime.format(Math.round(seconds / unitSeconds), unit)
}
