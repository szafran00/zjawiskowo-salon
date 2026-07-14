import { urlFor } from '@/sanity/lib/image'
import type { SanityImage } from './types'

// Returns a usable image URL: a Sanity asset if present, otherwise a fallback URL.
export function imgUrl(
  source: SanityImage | undefined | null,
  fallback: string,
  width = 1200
): string {
  if (source && (source as { asset?: unknown }).asset) {
    try {
      return urlFor(source).width(width).quality(78).auto('format').url()
    } catch {
      return fallback
    }
  }
  return fallback
}
