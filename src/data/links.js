// 友情链接配置：直接打包进前端，不请求 /links.json 或 /link.json。
// 每个域名对应一个二维数组：[显示名称, URL]
const FRIENDLY_LINKS = {
  // 正式域名
  'xn--opl235-931i.haijav.top': [
   ['绿色导航', 'https://煐毳誩v.greendh.org/喆r甦'],
  ['找AV导航', 'https://4pmycp.zavdh18.qpon/zapat9kp'],
  ['花小猪导航', 'https://棽蹵祎.9qqq.cc/粺锳'],
  ['妖涩梨导航', 'https://嗷嗷嗷嗷嗷.yaosl1.sbs/?mark=AMUDEQ'],
  ['娱乐青导航', 'http://905ylq.yuleqing17.cc/app/9jwNrQ'],
  ['红浪漫导航', 'http://905llm.hlmhs3.top/app/FRXmEu'],
  ['双马尾导航', 'http://905smw.smaw3.top/app/F1wRz0'],
  ['东方色导航', 'http://905dong.dfswh3.top/app/avlPA5'],
  ['冈本导航', 'http://905ben.gangben4.top/app/4Zef7t'],
  ['荔枝导航', 'http://905lizhi.lizhidh4.top/app/XjCDt3']
  ],
  'xn--xn--ifia-5058c.haijav.top': [
    ['蓝色导航', 'https://nzru.bluedh63.loan/cqyhw37'],
  ['蓝导航', 'https://3pssi.landh17.party/nvrdcdl'],
  ['福利嫂导航', 'https://顺.flsgo.cc/世界和平.html'],
  ['6DD导航', 'http://9056dd.6ddd6.top/app/yWwBfN'],
  ['红颜导航', 'http://905hy.hongyan3.top/app/MTuLXt'],
  ['柳如烟导航', 'http://905lry.lrydd2.cc/app/5jxu9W'],
  ['22点导航', 'http://ws10d905.ws10d3.cc/app/Czk3Zf'],
  ['哇嘎入口', 'http://905wgrk.wgrk3.cc/app/6xqcRh'],
  ['3838导航', 'http://90538.3838dh2.top/app/i5lwv4'],
  ['大丈夫导航', 'http://905heping.dazf3.top/app/gohQUh']
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
