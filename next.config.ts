import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Nie blokuj builda ostrzeżeniami ESLint (np. <img> zamiast next/image — świadome).
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
