const DEFAULT_ORIGIN = 'https://191.985av.top'
const UPSTREAM_PREFIX = '/api.php/provide/vod'
const CACHE_CONTROL = 'public, s-maxage=60, max-age=15, stale-while-revalidate=120'
const ALLOWED_HOSTS = new Set(['acv12.top', 'www.acv12.top', 'acc118.top', 'www.acc118.top'])

function allowedOrigin(origin) {
  if (!origin) return null
  try {
    const url = new URL(origin)
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') return null
    if (ALLOWED_HOSTS.has(url.hostname)) return origin
    if (url.hostname.endsWith('.yyxvt.pages.dev')) return origin
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return origin
  } catch (_) {}
  return null
}

function corsHeaders(request) {
  const origin = allowedOrigin(request.headers.get('Origin'))
  const headers = {
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  }
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin
    headers.Vary = 'Origin'
  }
  return headers
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}

function json(data, status, headers) {
  return Response.json(data, { status, headers })
}

export async function onRequest(context) {
  const method = context.request.method.toUpperCase()
  const baseHeaders = { ...corsHeaders(context.request), ...securityHeaders() }
  const origin = context.request.headers.get('Origin')
  if (origin && !allowedOrigin(origin)) {
    return json({ code: 403, msg: 'Origin Not Allowed' }, 403, baseHeaders)
  }
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: baseHeaders })
  if (!['GET', 'HEAD'].includes(method)) return json({ code: 405, msg: 'Method Not Allowed' }, 405, { ...baseHeaders, Allow: 'GET, HEAD, OPTIONS' })

  const incoming = new URL(context.request.url)
  const relativePath = incoming.pathname.replace(/^\/api(?=\/|$)/, '') || '/'
  if (relativePath !== UPSTREAM_PREFIX && !relativePath.startsWith(`${UPSTREAM_PREFIX}/`)) {
    return json({ code: 404, msg: 'Not Found' }, 404, baseHeaders)
  }
  if (incoming.search.length > 2048) return json({ code: 414, msg: 'Request URI Too Long' }, 414, baseHeaders)

  const originFromEnv = context.env?.API_ORIGIN || DEFAULT_ORIGIN
  let target
  try {
    target = new URL(relativePath, originFromEnv)
    target.search = incoming.search
  } catch (_) {
    return json({ code: 500, msg: 'API configuration error' }, 500, baseHeaders)
  }

  const headers = new Headers({ Accept: 'application/json, text/plain, */*' })
  try {
    const response = await fetch(new Request(target.toString(), { method, headers, redirect: 'follow' }))
    const out = new Headers(baseHeaders)
    const contentType = response.headers.get('content-type')
    if (contentType) out.set('Content-Type', contentType)
    if (method === 'GET' || method === 'HEAD') out.set('Cache-Control', CACHE_CONTROL)
    out.delete('set-cookie')
    return new Response(response.body, { status: response.status, headers: out })
  } catch (_) {
    return json({ code: -1, msg: '上游 API 暂时不可用' }, 502, baseHeaders)
  }
}
