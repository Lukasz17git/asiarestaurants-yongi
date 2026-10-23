// Builds and reads change-request issues in the GitHub forms' format (.github/ISSUE_TEMPLATE),
// so the workflow picks the branch the same way for both
const { mainBranch, getBranchUrl } = require('./github')

const promoteAction = 'Usar este diseño como principal'

// Each editor action -> the form's "¿Dónde?" (and "Acción"), plus a hidden note for Claude
const requestTypes = {
    edit: {
        where: 'Actual',
        note: (ref) => (ref === mainBranch ? 'Cambia la web principal.' : `Cambia el diseño ${ref}, no la web principal.`),
    },
    new: {
        where: 'Nuevo diseño',
        note: () => 'Es un diseño nuevo: parte de la web principal y va en su propia rama y dirección.',
    },
    promote: {
        where: 'Web principal',
        action: promoteAction,
        note: (ref) => `El cliente quiere que la web principal pase a ser el diseño ${ref}.`,
    },
}

const maxTextLength = 5000
const maxNameLength = 60
const maxImages = 20
const imageUrlPattern = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/\S+$/i
const imagePatterns = [
    /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g,
    // GitHub's own attachments ('<img width="..." alt="Image" src="https://github.com/user-attachments/...">')
    /<img [^>]*?alt="([^"]*)"[^>]*?src="([^"]+)"[^>]*>/g,
]

const getSiteName = (ref) => (ref === mainBranch ? 'de la web principal' : `del diseño ${ref}`)

// A typed '### ¿Dónde?' would read as another form field: '#' at a line start -> '\#'
const escapeHeadings = (text) => text.replace(/^(\s*)#/gm, '$1\\#')

const toImagesMarkdown = (images) => images.map(({ name, url }) => `![${name}](${url})`).join('\n')

// '' when the text and images are valid, else what's wrong (in Spanish, shown as is); `optional`: '' text is fine
const getPayloadError = ({ text, images }, { optional = false } = {}) => {
    if (typeof text !== 'string' || (!optional && !text.trim())) return 'Escribe qué quieres cambiar.'
    if (text.length > maxTextLength) return `El texto pasa de ${maxTextLength} caracteres.`
    if (!Array.isArray(images) || images.length > maxImages) return `Puedes enviar hasta ${maxImages} imágenes.`
    if (images.some(({ url }) => !imageUrlPattern.test(url))) return 'Alguna imagen no se ha subido bien. Vuelve a añadirla.'
    return ''
}

// Without '[', ']', '(' and ')', which would break the '![name](url)' link
const cleanImages = (images) => images.map(({ name, url }) => ({ name: String(name ?? '').replace(/[[\]()\n]/g, '').trim().slice(0, 80) || 'imagen', url }))

// One line, so it can't add a '### ' section of its own
const cleanName = (name) => String(name ?? '').replace(/\s+/g, ' ').trim().slice(0, maxNameLength)

// Only '/menu'-like paths, so a '-->' can't close the hidden comment early
const cleanPage = (page) => String(page ?? '').replace(/[^\w/.-]/g, '').slice(0, 100) || '/'

const getPromoteText = (ref, note) => [`Usar el diseño ${ref} como web principal.`, note.trim()].filter(Boolean).join('\n\n')

const buildIssueBody = ({ type, name, text, ref, page, images }) => {
    const { where, action, note } = requestTypes[type]
    return [
        '### Diseño', ref,
        '### ¿Dónde?', where,
        ...(name ? ['### Nombre del diseño', escapeHeadings(name)] : []),
        ...(action ? ['### Acción', action] : []),
        '### ¿Qué quieres cambiar?', escapeHeadings(type === 'promote' ? getPromoteText(ref, text) : text.trim()),
        ...(images.length ? ['### Imágenes', toImagesMarkdown(images)] : []),
        `<!-- Enviado desde la web, en la página ${page} ${getSiteName(ref)}. ${note(ref)} -->`,
    ].join('\n\n')
}

const buildCommentBody = ({ text, page, images }) => [
    escapeHeadings(text.trim()),
    ...(images.length ? [toImagesMarkdown(images)] : []),
    `<!-- Enviado desde la web, en la página ${page} -->`,
].join('\n\n')

// A new design is titled by its name, so "Ver diseños" lists it by it
const getTitle = ({ type, name, text, ref }) => {
    if (type === 'promote') return `Usar ${ref} como web principal`
    if (type === 'new') return name
    const firstLine = text.trim().split('\n')[0]
    return firstLine.length > 70 ? `${firstLine.slice(0, 67)}...` : firstLine
}

// Text under each '### ' heading, first one of each name ('Diseño' -> 'lucas-v2')
const getSections = (body) => {
    const sections = {}
    let current = null
    body.replace(/\r/g, '').split('\n').forEach((line) => {
        const heading = line.match(/^### (.+)$/)
        if (heading) {
            current = sections[heading[1]] === undefined ? heading[1] : null
            if (current) sections[current] = ''
            return
        }
        if (current) sections[current] += `${line}\n`
    })
    return sections
}

const getField = (sections, name) => (sections[name] ?? '').trim().split('\n')[0].trim()

// Same rule as the "Pick the branch" step of claude-issues.yml
const getBranch = (issue) => {
    const sections = getSections(issue.body ?? '')
    const where = getField(sections, '¿Dónde?')
    if (where === 'Nuevo diseño') return `diseno-${issue.number}`
    if (where === 'Actual') return getField(sections, 'Diseño') || mainBranch
    return mainBranch
}

// Text without HTML comments and '\#', and the images it links, each once
const toMessageContent = (markdown) => {
    const images = []
    const text = imagePatterns.reduce((rest, pattern) => rest.replace(pattern, (match, name, url) => {
        if (!images.some((image) => image.url === url)) images.push({ name, url })
        return ''
    }), markdown.replace(/<!--[\s\S]*?-->/g, ''))
    return { text: text.replace(/^(\s*)\\#/gm, '$1#').replace(/\n{3,}/g, '\n\n').trim(), images }
}

// The request as the client wrote it: its "¿Qué quieres cambiar?" and "Imágenes" (the whole body in old issues)
const getRequestContent = (body) => {
    const sections = getSections(body ?? '')
    const change = sections['¿Qué quieres cambiar?'] ?? body ?? ''
    return toMessageContent(`${change}\n${sections['Imágenes'] ?? ''}`)
}

const toSummary = (issue, workingTitles) => {
    const branch = getBranch(issue)
    return {
        number: issue.number,
        title: issue.title,
        branch,
        url: getBranchUrl(branch),
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        comments: issue.comments,
        closed: issue.state === 'closed',
        working: workingTitles.includes(issue.title),
    }
}

module.exports = {
    requestTypes,
    getPayloadError,
    cleanImages,
    cleanName,
    cleanPage,
    buildIssueBody,
    buildCommentBody,
    getTitle,
    getBranch,
    getRequestContent,
    toMessageContent,
    toSummary,
}
