import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 12000 })
const cache = new Map()
const pending = new Map()
const TTL = 60_000

function cacheKey(path, params = {}) {
  const query = Object.entries(params).filter(([, value]) => value !== undefined && value !== '').sort(([a], [b]) => a.localeCompare(b))
  return `${path}?${new URLSearchParams(query).toString()}`
}

function payload(response) {
  const root = response?.data
  if (root?.data && typeof root.data === 'object' && !Array.isArray(root.data)) return root.data
  return root || {}
}

export function normalizeVod(v = {}) {
  return {
    id: v.vod_id,
    title: v.vod_name || '未命名内容',
    poster: v.vod_pic || v.vod_pic_thumb || v.vod_pic_slide || '',
    year: v.vod_year || '',
    area: v.vod_area || '',
    typeId: v.type_id || '',
    typeName: v.type_name || v.vod_class || '',
    score: v.vod_score || '',
    remarks: v.vod_remarks || v.vod_blurb || '',
    duration: v.vod_duration || '',
    views: v.vod_hits || v.vod_hits_day || 0,
    actor: v.vod_actor || '',
    director: v.vod_director || '',
    content: v.vod_content || v.vod_blurb || '',
    playFrom: v.vod_play_from || '',
    playUrl: v.vod_play_url || '',
    raw: v
  }
}

async function request(path, params = {}) {
  const k = cacheKey(path, params)
  const cached = cache.get(k)
  if (cached && Date.now() - cached.time < TTL) return cached.value
  if (pending.has(k)) return pending.get(k)

  const task = api.get(path, { params }).then(response => {
    const result = { response, data: payload(response) }
    cache.set(k, { time: Date.now(), value: result })
    return result
  }).finally(() => pending.delete(k))

  pending.set(k, task)
  return task
}

const endpoint = '/api.php/provide/vod/'

export async function getClasses() {
  const result = await request(endpoint, { ac: 'list', pg: 1, pagesize: 100 })
  return result.data?.class || []
}

export async function getVideos({ page = 1, limit = 18, typeId, keyword, sort } = {}) {
  const result = await request(endpoint, {
    ac: 'detail',
    pg: Math.max(1, Number(page) || 1),
    limit,
    t: typeId,
    wd: keyword?.trim(),
    sort
  })
  return {
    list: Array.isArray(result.data?.list) ? result.data.list.map(normalizeVod) : [],
    page: Number(result.data?.page || page || 1),
    pageCount: Number(result.data?.pagecount || result.data?.page_count || 1),
    total: Number(result.data?.total || 0)
  }
}

export const getLatestVideos = (page = 1, limit = 18) => getVideos({ page, limit })
export const getHotVideos = (page = 1, limit = 18) => getVideos({ page, limit, sort: 'hits' })
export const getCategoryVideos = (typeId, page = 1, limit = 18) => getVideos({ typeId, page, limit })
export const searchVideos = (keyword, page = 1, limit = 18) => getVideos({ keyword, page, limit })

export async function getDetail(id) {
  const result = await request(endpoint, { ac: 'detail', ids: id })
  const item = Array.isArray(result.data?.list) ? result.data.list[0] : null
  return item ? normalizeVod(item) : null
}

export const clearCache = () => { cache.clear(); pending.clear() }
