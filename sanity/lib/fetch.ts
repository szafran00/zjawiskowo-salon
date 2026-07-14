import { client } from './client'

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  // Świeże dane: edycje w Sanity widoczne od razu po publikacji (bez laga ISR).
  return client.fetch<T>(query, params, {
    cache: 'no-store',
  })
}
