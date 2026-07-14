'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RevealInit() {
  const pathname = usePathname()
  useEffect(() => {
    document.documentElement.classList.add('reveal-ready')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    // let the new route paint before observing
    const id = window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    }, 40)
    return () => {
      window.clearTimeout(id)
      io.disconnect()
    }
  }, [pathname])
  return null
}
