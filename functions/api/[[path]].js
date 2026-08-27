const ORIGIN = 'https://www.hlzy.store'
const UPSTREAM_PREFIX = '/api.php/provide/vod'
const CACHE_CONTROL = 'public, s-maxage=60, max-age=15, stale-while-revalidate=120'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  }
}
function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}

export async function onRequest(context) {
  const method = context.request.method.toUpperCase()
  const baseHeaders = { ...corsHeaders(), ...securityHeaders() }
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: baseHeaders })
  if (!['GET', 'HEAD'].includes(method)) return Response.json({ code: 405, msg: 'Method Not Allowed' }, { status: 405, headers: { ...baseHeaders, Allow: 'GET, HEAD, OPTIONS' } })

  const incoming = new URL(context.request.url)
  const relativePath = incoming.pathname.replace(/^\/api(?=\/|$)/, '') || '/'
  if (relativePath !== UPSTREAM_PREFIX && !relativePath.startsWith(`${UPSTREAM_PREFIX}/`)) {
    return Response.json({ code: 404, msg: 'Not Found' }, { status: 404, headers: baseHeaders })
  }
  if (incoming.search.length > 2048) return Response.json({ code: 414, msg: 'Request URI Too Long' }, { status: 414, headers: baseHeaders })

  const target = new URL(relativePath, ORIGIN)
  target.search = incoming.search
  const headers = new Headers({ Accept: 'application/json, text/plain, */*' })

  try {
    const response = await fetch(new Request(target.toString(), { method, headers, redirect: 'follow' }))
    const out = new Headers(baseHeaders)
    const contentType = response.headers.get('content-type')
    if (contentType) out.set('Content-Type', contentType)
    if (method === 'GET' || method === 'HEAD') out.set('Cache-Control', CACHE_CONTROL)
    out.delete('set-cookie')
    return new Response(response.body, { status: response.status, headers: out })
  } catch {
    return Response.json({ code: -1, msg: '上游 API 暂时不可用' }, { status: 502, headers: baseHeaders })
  }
}
