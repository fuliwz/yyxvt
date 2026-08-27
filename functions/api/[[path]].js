const ORIGIN = 'https://www.hlzy.store'
const CACHE_CONTROL = 'public, s-maxage=60, max-age=15, stale-while-revalidate=120'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  }
}

export async function onRequest(context) {
  const method = context.request.method.toUpperCase()
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() })

  const incoming = new URL(context.request.url)
  const upstreamPath = incoming.pathname.replace(/^\/api/, '') || '/'
  const target = new URL(upstreamPath, ORIGIN)
  target.search = incoming.search

  const headers = new Headers(context.request.headers)
  headers.set('Accept', 'application/json, text/plain, */*')
  headers.delete('Host')
  headers.delete('Origin')
  headers.delete('Referer')
  headers.delete('Cookie')

  try {
    const response = await fetch(new Request(target.toString(), {
      method,
      headers,
      body: ['GET', 'HEAD'].includes(method) ? undefined : context.request.body,
      redirect: 'follow'
    }))
    const out = new Headers(response.headers)
    for (const [key, value] of Object.entries(corsHeaders())) out.set(key, value)
    if (method === 'GET' || method === 'HEAD') out.set('Cache-Control', CACHE_CONTROL)
    else out.set('Cache-Control', 'no-store')
    out.delete('set-cookie')
    return new Response(response.body, { status: response.status, headers: out })
  } catch {
    return Response.json({ code: -1, msg: '上游 API 暂时不可用' }, { status: 502, headers: corsHeaders() })
  }
}
