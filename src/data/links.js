// 友情链接：直接打包进前端，不通过 /links.json 或 /link.json 请求。
// 使用当前页面 hostname 选择对应链接。
export const FRIENDLY_LINKS = {
  'acv12.top': [],
  'acc118.top': []
}

export function getFriendlyLinks(hostname = window.location.hostname) {
  const host = String(hostname || '').toLowerCase().split(':')[0].replace(/^www\./, '')
  return FRIENDLY_LINKS[host] || []
}
