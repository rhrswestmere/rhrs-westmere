export async function pdfUrl(element) {
  const { registerFonts } = await loadPdfModule(() => import('./fonts.js'))
  registerFonts()
  const { pdf } = await loadPdfModule(() => import('@react-pdf/renderer'))
  const blob = await pdf(element).toBlob()
  return URL.createObjectURL(blob)
}

// After a deploy the browser can still hold an old bundle whose hashed chunks
// no longer exist on the server (import fails with a fetch error). Reload once
// so the visitor gets the fresh build instead of a dead PDF button.
const STALE_KEY = 'rhrs-stale-chunk-reload'

export async function loadPdfModule(importer) {
  try {
    const mod = await importer()
    try { sessionStorage.removeItem(STALE_KEY) } catch { /* ignore */ }
    return mod
  } catch (err) {
    const msg = String(err?.message || err)
    const stale = /dynamically imported module|module script failed|importing a module script failed/i.test(msg)
    let seen = false
    try {
      seen = Boolean(sessionStorage.getItem(STALE_KEY))
      if (stale && !seen) sessionStorage.setItem(STALE_KEY, '1')
    } catch { /* ignore */ }
    if (stale && !seen) window.location.reload()
    throw err
  }
}

export async function fetchImageBase64(url) {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
