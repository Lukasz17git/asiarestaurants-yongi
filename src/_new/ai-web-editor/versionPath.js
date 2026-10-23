// An older version opens at '/_history/3/menu': middleware.js serves it from its own deploy, so the address stays the
// site's. public/index.html sets <base href> with the same rule, so its files load from '/_history/3/'
export const historyBasename = window.location.pathname.match(/^\/_history\/\d+/)?.[0] ?? ''

// 3 on '/_history/3/menu', null on the site's own pages
export const historyNumber = historyBasename ? Number(historyBasename.split('/')[2]) : null

// '/_history/3/menu' -> '/menu', the page to open on another site or version
export const getPagePath = () => window.location.pathname.slice(historyBasename.length) || '/'
