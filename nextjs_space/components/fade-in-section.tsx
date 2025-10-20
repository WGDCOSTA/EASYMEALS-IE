
'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface FadeInSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeInSection({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: FadeInSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-visible')
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [delay])

  const getInitialStyle = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, transform: 'translateY(30px)' }
      case 'down':
        return { opacity: 0, transform: 'translateY(-30px)' }
      case 'left':
        return { opacity: 0, transform: 'translateX(30px)' }
      case 'right':
        return { opacity: 0, transform: 'translateX(-30px)' }
      case 'none':
        return { opacity: 0 }
      default:
        return { opacity: 0, transform: 'translateY(30px)' }
    }
  }

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${className}`}
      style={getInitialStyle()}
    >
      {children}
      <style jsx>{`
        .is-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
      `}</style>
    </div>
  )
}
