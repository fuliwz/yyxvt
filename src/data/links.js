// 友情链接配置：直接打包进前端，不请求 /links.json 或 /link.json。
// 每个域名对应一个二维数组：[显示名称, URL]
export default {
  'acv12.top': [
    ['站点A', 'https://example.com/'],
    ['站点B', 'https://example2.com/']
  ],
  'acc118.top': [
    ['站点C', 'https://example3.com/']
  ]
}

export function getFriendlyLinks(hostname = window.location.hostname) {
  const host = String(hostname || '').toLowerCase().split(':')[0].replace(/^www\./, '')
  return (exportedLinks[host] || []).map(([name, url]) => ({ name, url }))
}

const exportedLinks = {
  'acv12.top': [
    ['站点A', 'https://example.com/'],
    ['站点B', 'https://example2.com/']
  ],
  'acc118.top': [
    ['站点C', 'https://example3.com/']
  ]
}
