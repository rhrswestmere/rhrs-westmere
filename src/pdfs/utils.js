export async function pdfUrl(element) {
  const { registerFonts } = await import('./fonts.js')
  registerFonts()
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(element).toBlob()
  return URL.createObjectURL(blob)
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
