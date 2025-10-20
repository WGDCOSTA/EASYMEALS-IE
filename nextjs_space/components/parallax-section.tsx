
'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
  backgroundImage?: string
}

export function ParallaxSection({ 
  children, 
  speed = 0.5, 
  className = '',
  backgroundImage 
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset || document.documentElement.scrollTop
      const offsetTop = sectionRef.current.offsetTop
      const yPos = -(scrolled - offsetTop) * speed

      // Only apply parallax when the section is in view
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        bgRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <div
          ref={bgRef}
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform',
            height: '120%',
            top: '-10%'
          }}
        />
      )}
      {children}
    </div>
  )
}
