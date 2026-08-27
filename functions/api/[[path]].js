const ORIGIN = 'https://www.hlzy.store'

export async function onRequest(context) {
  const incoming = new URL(context.request.url)
  const upstreamPath = incoming.pathname.replace(/^\/api/, '') || '/'
  const target = new URL(upstreamPath, ORIGIN)
  target.search = incoming.search

  const headers = new Headers(context.request.headers)
  headers.set('Accept', 'application/json, text/plain, */*')
  headers.delete('Host')
  headers.delete('Origin')
  headers.delete('Referer')

  try {
    const response = await fetch(new Request(target.toString(), {
      method: context.request.method,
      headers,
      body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
      redirect: 'follow'
    }))
    const out = new Headers(response.headers)
    out.set('Access-Control-Allow-Origin', '*')
    out.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS')
    out.set('Cache-Control', 'public, s-maxage=60, max-age=15, stale-while-revalidate=120')
    out.delete('set-cookie')
    return new Response(response.body, { status: response.status, headers: out })
  } catch (error) {
    return Response.json({ code: -1, msg: '上游 API 暂时不可用' }, { status: 502 })
  }
}
