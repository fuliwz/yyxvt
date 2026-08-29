// 友情链接配置：直接打包进前端，不请求 /links.json 或 /link.json。
// 每个域名对应一个二维数组：[显示名称, URL]
const FRIENDLY_LINKS = {
  // 正式域名
  'xn--opl235-931i.haijav.top': [
   ['绿色导航', 'https://煐毳誩v.greendh.org/喆r甦'],
  ['找AV导航', 'https://4pmycp.zavdh18.qpon/zapat9kp'],
  ['花小猪导航', 'https://棽蹵祎.9qqq.cc/粺锳'],
  ['妖涩梨导航', 'https://嗷嗷嗷嗷.yaosl1.sbs/?mark=Q1TN3T'],
  ['娱乐青导航', 'http://819ylq.yuleqing17.cc/app/Mf4viP'],
  ['红浪漫导航', 'http://819llm.hlmhs3.top/app/gcbfcV'],
  ['双马尾导航', 'http://819smw.smaw3.top/app/TtgjWr'],
  ['东方色导航', 'http://819dong.dfswh3.top/app/Af2z8v'],
  ['冈本导航', 'http://614ben.gangben3.top/app/0BU7ve'],
  ['荔枝导航', 'http://627lizhii.lizhidh3.top/app/tosXlA']
  ],
  'xn--xn--ifia-5058c.haijav.top': [
    ['蓝色导航', 'https://nzru.bluedh63.loan/cqyhw37'],
  ['蓝导航', 'https://3pssi.landh17.party/nvrdcdl'],
  ['福利嫂导航', 'https://顺.flsgo.cc/世界和平.html'],
  ['6DD导航', 'http://6146d.5ddd6.top/app/f6nEP9'],
  ['红颜导航', 'http://614hy.hongyan2.top/app/O18VPF'],
  ['柳如烟导航', 'http://508lry.lrydd.top/app/psEPAJ'],
  ['22点导航', 'http://ws10d511.ws10d1.top/app/PITIMm'],
  ['哇嘎入口', 'http://625wgrk.wgrk2.top/app/0UDKsv'],
  ['3838导航', 'http://62338.3838dh1.top/app/FzsCgx'],
  ['大丈夫导航', 'http://627heping.dazf2.top/app/dN3vzo']
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
