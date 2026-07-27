// Zamienia zwykły adres filmu z YouTube lub Vimeo na adres do osadzenia.
// Klientka wkleja w panelu link taki, jaki widzi w przeglądarce.
export function embedUrl(url?: string): string | undefined {
  if (!url) return undefined
  const raw = url.trim()
  if (!raw) return undefined

  // Już gotowy adres do osadzenia.
  if (/\/embed\/|player\.vimeo\.com/.test(raw)) return raw

  const yt =
    raw.match(/(?:youtube\.com\/(?:watch\?[^#]*\bv=|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/) ||
    null
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`

  const vm = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`

  return undefined
}
