import { useEffect, useRef } from 'react'

export function CampusBackdrop() {
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = layer.current
    if (!background) return
    const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')

    function follow(event: PointerEvent) {
      if (!motion.matches || event.pointerType === 'touch') return
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      background?.style.setProperty('--light-x', `${x * 100}%`)
      background?.style.setProperty('--light-y', `${y * 100}%`)
      background?.style.setProperty('--drift-x', `${(x - .5) * -24}px`)
      background?.style.setProperty('--drift-y', `${(y - .5) * -18}px`)
    }

    function reset() {
      for (const property of ['--light-x', '--light-y', '--drift-x', '--drift-y']) {
        background?.style.removeProperty(property)
      }
    }

    window.addEventListener('pointermove', follow, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    motion.addEventListener('change', reset)
    return () => {
      window.removeEventListener('pointermove', follow)
      document.documentElement.removeEventListener('pointerleave', reset)
      motion.removeEventListener('change', reset)
    }
  }, [])

  return <div className="campus-backdrop" ref={layer} aria-hidden="true" />
}
