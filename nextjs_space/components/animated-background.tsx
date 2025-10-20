
'use client'

import { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'waves' | 'particles' | 'gradient'
  color?: string
}

export function AnimatedBackground({ variant = 'waves', color = '#84cc16' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    if (variant === 'waves') {
      let offset = 0

      const drawWaves = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw multiple wave layers
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2)

          for (let x = 0; x < canvas.width; x++) {
            const y = Math.sin((x + offset + i * 100) * 0.01) * 30 + canvas.height / 2 + i * 20
            ctx.lineTo(x, y)
          }

          ctx.lineTo(canvas.width, canvas.height)
          ctx.lineTo(0, canvas.height)
          ctx.closePath()

          ctx.fillStyle = `${color}${Math.floor((0.1 - i * 0.03) * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
        }

        offset += 0.5
        animationFrameId = requestAnimationFrame(drawWaves)
      }

      drawWaves()
    } else if (variant === 'particles') {
      const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []

      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1
        })
      }

      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle) => {
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `${color}40`
          ctx.fill()

          // Draw connections
          particles.forEach((other) => {
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `${color}${Math.floor((1 - distance / 100) * 50).toString(16).padStart(2, '0')}`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          })
        })

        animationFrameId = requestAnimationFrame(drawParticles)
      }

      drawParticles()
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [variant, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
