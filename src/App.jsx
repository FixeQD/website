import { useState, useEffect, useCallback } from 'react'
import Scene from './components/Scene'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Lab from './sections/Lab'
import { useScrollProgressState } from './hooks/index'

const SCROLL_HEIGHT = '480vh'
const CHAPTER_COUNT = 4

export default function App() {
  const scroll = useScrollProgressState()
  const raw = scroll * (CHAPTER_COUNT - 1)
  const chapter = Math.min(Math.floor(raw + 0.5), CHAPTER_COUNT - 1)

  const jumpTo = useCallback((idx) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = (idx / (CHAPTER_COUNT - 1)) * max
    window.scrollTo({ top: target, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = max > 0 ? window.scrollY / max : 0;
        const currentRaw = currentProgress * (CHAPTER_COUNT - 1);
        const currentChapter = Math.floor(currentRaw + 0.5);
        
        const direction = e.shiftKey ? -1 : 1;
        const nextChapter = Math.max(0, Math.min(currentChapter + direction, CHAPTER_COUNT - 1));
        
        jumpTo(nextChapter);
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jumpTo]);

  return (
    <>
      <Scene />
      <Nav chapter={chapter} scroll={scroll} onJump={jumpTo} />

      <div style={{ position: 'fixed', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
        <Hero progress={raw - 0} />
        <About progress={raw - 1} />
        <Projects progress={raw - 2} />
        <Lab progress={raw - 3} />
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '45%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(var(--accent-rgb), 0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />

      <div style={{ height: SCROLL_HEIGHT, position: 'relative', zIndex: 1 }} aria-hidden />
    </>
  )
}

