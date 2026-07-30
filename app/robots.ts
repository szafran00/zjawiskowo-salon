import type { MetadataRoute } from 'next'
import { indexingAllowed } from './lib/indexing'

// Blokada działa dwutorowo: sam robots.txt wstrzymuje tylko odwiedziny robota,
// a adres podlinkowany z zewnątrz i tak może trafić do indeksu. Drugą warstwą
// jest znacznik noindex ustawiany w app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/studio' }],
  }
}
