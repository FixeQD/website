import { useEffect, useState, useRef } from 'react'
import { me } from '../data'
import { useScrollProgress } from '../hooks'

const SECTIONS = ['Hero', 'About', 'Projects', 'Lab']
const CHAPTER_COUNT = SECTIONS.length

export default function Nav({ chapter, onJump }) {
  const [scrolled, setScrolled] = useState(false)
  const bannerRef = useRef(null)
  const [bannerHeight, setBannerHeight] = useState(0)
  const scrollRef = useScrollProgress()
  const barRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    let raf
    const update = () => {
      if (barRef.current) {
        barRef.current.style.height = `${scrollRef.current * 100}%`
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [scrollRef])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!bannerRef.current) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBannerHeight(entry.target.offsetHeight)
      }
    })
    obs.observe(bannerRef.current)
    return () => obs.disconnect()
  }, [])

  const onTrackClick = (e) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    const idx = Math.round(ratio * (CHAPTER_COUNT - 1))
    onJump(idx)
  }

  return (
    <>
      <div
        id="lockdown-countdown"
        ref={bannerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 110,
          width: "100%",
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateY(${scrolled ? 12 : bannerHeight}px)`,
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: scrolled ? '1100px' : '100vw',
            padding: scrolled ? '0.75rem 1.5rem' : '1.2rem 2rem',
            transition: 'all 0.5s ease-in-out',
            background: scrolled ? 'rgba(6,6,9,0.7)' : 'transparent',
            backdropFilter: scrolled ? 'blur(14px)' : 'none',
            border: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
            borderRadius: scrolled ? '16px' : '0',
          }}
        >
          <button
            onClick={() => onJump(0)}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            {me.handle}
          </button>

          <a
            href="https://github.com/FixeQD"
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.78rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              border: '1px solid rgba(var(--accent-rgb), 0.28)',
              padding: '0.32rem 0.85rem',
              borderRadius: '4px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            GitHub →
          </a>
        </nav>
      </div>

      <div
        ref={trackRef}
        onClick={onTrackClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.key === ' ') e.preventDefault()
            onTrackClick(e)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Scroll progress"
        style={{
          position: 'fixed',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 3,
          height: '30vh',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          zIndex: 100,
          cursor: 'pointer',
          outline: 'none',
        }}
        onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(var(--accent-rgb), 0.5)'}
        onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '0%',
            background: 'rgba(var(--accent-rgb), 0.35)',
            borderRadius: 2,
          }}
        />

        {SECTIONS.map((s, i) => {
          const y = (i / (CHAPTER_COUNT - 1)) * 100
          const isActive = chapter === i
          return (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); onJump(i) }}
              style={{
                position: 'absolute',
                top: `${y}%`,
                right: 14,
                transform: 'translateY(-50%)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 0',
                transition: 'color 0.3s, opacity 0.3s',
                opacity: isActive ? 1 : 0.6,
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </button>
          )
        })}

        {SECTIONS.map((s, i) => {
          const y = (i / (CHAPTER_COUNT - 1)) * 100
          return (
            <div
              key={`tick-${s}`}
              style={{
                position: 'absolute',
                top: `${y}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: chapter === i ? 5 : 3,
                height: 1,
                background: chapter === i ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                borderRadius: 1,
                transition: 'width 0.3s, background 0.3s',
              }}
            />
          )
        })}
      </div>
    </>
  )
}
