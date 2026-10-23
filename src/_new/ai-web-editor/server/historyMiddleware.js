// Vercel Routing Middleware (ESM, unlike the rest of server/): '/_history/3/menu' shows '/menu' of version 3's own
// deploy ('https://asiarestaurants-yongi-4ngnuz0np-....vercel.app'), keeping the site's address. Its relative files
// come back through here, since public/index.html sets <base href='/_history/3/'>
const deployUrls = new Map()

// Asks the function (?action=history, kept an hour by the CDN); a version's deploy never changes
const findDeployUrl = async (number, request) => {
    if (deployUrls.has(number)) return deployUrls.get(number)
    const res = await fetch(new URL(`/api/ai-editor?action=history&number=${number}`, request.url))
    if (!res.ok) return null
    const { url } = await res.json()
    deployUrls.set(number, url)
    return url
}

const historyMiddleware = async (request) => {
    const { pathname, search } = new URL(request.url)
    const [, number, path = '/'] = pathname.match(/^\/_history\/(\d+)(\/.*)?$/) ?? []
    const deployUrl = number && (await findDeployUrl(number, request))
    if (!deployUrl) return new Response('Esta versión no existe.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
    return new Response(null, { headers: { 'x-middleware-rewrite': `${deployUrl}${path}${search}` } })
}

export default historyMiddleware
