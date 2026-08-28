// 友情链接配置：直接打包进前端，不请求 /links.json 或 /link.json。
// 每个域名对应一个二维数组：[显示名称, URL]
const FRIENDLY_LINKS = {
  // 正式域名
  'acv12.top': [
    ['站点A', 'https://example.com/'],
    ['站点B', 'https://example2.com/']
  ],
  'acc118.top': [
    ['站点C', 'https://example3.com/']
  ],

  // Cloudflare Pages 预览域名统一使用默认友情链接。
  '*.yyxvt.pages.dev': [
    ['站点A', 'https://example.com/'],
    ['站点B', 'https://example2.com/']
  ]
}

export default FRIENDLY_LINKS

export function getFriendlyLinks(hostname = window.location.hostname) {
  const host = String(hostname || '').toLowerCase().split(':')[0].replace(/^www\./, '')

  if (Object.prototype.hasOwnProperty.call(FRIENDLY_LINKS, host)) {
    return FRIENDLY_LINKS[host]
  }

  if (host.endsWith('.yyxvt.pages.dev')) {
    return FRIENDLY_LINKS['*.yyxvt.pages.dev'] || []
  }

  return []
}
