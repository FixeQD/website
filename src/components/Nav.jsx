import { useEffect, useState, useRef } from 'react'
import { me } from '../data'

const SECTIONS = ['hero', 'about', 'projects', 'lab']
const CHAPTER_COUNT = SECTIONS.length

export default function Nav({ chapter, scroll, onJump }) {
  const [scrolled, setScrolled] = useState(false)
  const trackRef = useRef(null)
  const bannerRef = useRef(null)
  const [bannerHeight, setBannerHeight] = useState(0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://keepandroidopen.org/banner.js?size=minimal&id=lockdown-countdown&animation=off"
    script.defer = true
    document.head.appendChild(script)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBannerHeight(entry.target.offsetHeight)
      }
    })

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      observer.disconnect()
    }
  }, [])

  const onTrackClick = (e) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
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
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: `${scroll * 100}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 8px rgba(var(--accent-rgb), 0.5)',
            transition: 'box-shadow 0.3s',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${scroll * 100}%`,
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

