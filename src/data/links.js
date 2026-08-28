// 友情链接配置：直接打包进前端，不请求 /links.json 或 /link.json。
// 每个域名对应一个二维数组：[显示名称, URL]
const FRIENDLY_LINKS = {
  'yyxvt.pages.dev'': [
    ['站点A', 'https://example.com/'],
    ['站点B', 'https://example2.com/']
  ],
  'acc118.top': [
    ['站点C', 'https://example3.com/']
  ]
}

export default FRIENDLY_LINKS

export function getFriendlyLinks(hostname = window.location.hostname) {
  const host = String(hostname || '').toLowerCase().split(':')[0].replace(/^www\./, '')
  return FRIENDLY_LINKS[host] || []
}
