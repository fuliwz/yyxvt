const KEY = 'yyxvt:history'
const LIMIT = 40

function read() {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}
function write(list) {
  if (typeof window === 'undefined') return false
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, LIMIT))); return true } catch { return false }
}

export function getHistory() { return read() }
export function saveHistory(item, episode = null) {
  if (!item?.id || typeof window === 'undefined') return
  const list = read().filter(entry => String(entry.id) !== String(item.id))
  list.unshift({ id:item.id, title:String(item.title || '').slice(0,300), poster:item.poster || '', typeName:String(item.typeName || '').slice(0,100), episode:String(episode?.label || '').slice(0,100), url:episode?.url || '', updatedAt:Date.now() })
  write(list)
}
export function removeHistory(id) { write(read().filter(entry => String(entry.id) !== String(id))) }
export function clearHistory() { if (typeof window === 'undefined') return; try { localStorage.removeItem(KEY) } catch {} }
