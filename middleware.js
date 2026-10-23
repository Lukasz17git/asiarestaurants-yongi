// Serves the older versions at '/_history/3/...' (src/_new/ai-web-editor/server/historyMiddleware.js)
export { default } from './src/_new/ai-web-editor/server/historyMiddleware'

export const config = { matcher: '/_history/:path*' }
