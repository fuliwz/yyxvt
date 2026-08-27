import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 10000 })
const cache = new Map()
const pending = new Map()
const TTL = 60_000

function key(path, params) {
  return `${path}?${new URLSearchParams(Object.entries(params).sort(([a], [b]) => a.localeCompare(b))).toString()}`
}

async function request(path, params = {}) {
  const k = key(path, params)
  const cached = cache.get(k)
  if (cached && Date.now() - cached.time < TTL) return cached.value
  if (pending.has(k)) return pending.get(k)
  const task = api.get(path, { params })
    .then((response) => {
      cache.set(k, { time: Date.now(), value: response })
      return response
    })
    .finally(() => pending.delete(k))
  pending.set(k, task)
  return task
}

export const getLatestVideos = (page = 1, limit = 18) => request('/api.php/provide/vod/', { ac: 'detail', pg: page, limit })
export const getHotVideos = (page = 1, limit = 18) => request('/api.php/provide/vod/', { ac: 'detail', pg: page, limit })
export const clearCache = () => cache.clear()
