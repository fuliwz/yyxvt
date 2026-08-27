const KEY = 'yyxvt:history'
const LIMIT = 40

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function getHistory() {
  return read()
}

export function saveHistory(item, episode = null) {
  if (!item?.id || typeof window === 'undefined') return
  const list = read().filter(entry => String(entry.id) !== String(item.id))
  list.unshift({
    id: item.id,
    title: item.title,
    poster: item.poster,
    typeName: item.typeName,
    episode: episode?.label || '',
    url: episode?.url || '',
    updatedAt: Date.now()
  })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, LIMIT)))
}

export function removeHistory(id) {
  const list = read().filter(entry => String(entry.id) !== String(id))
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
