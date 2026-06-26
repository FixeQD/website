import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef     = useRef(null);
  const ringPosRef = useRef(null);
  const ringSclRef = useRef(null);

  useEffect(() => {
    // Inject cursor:none for all elements
    const style = document.createElement('style');
    style.id = 'cursor-none';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    const mouse   = { x: -200, y: -200 };
    const ringPos = { x: -200, y: -200 };
    const dotOp   = { val: 0 };

    let scaleTarget = 1.0;
    let scaleCur    = 1.0;
    let isHovering  = false;
    let isClicking  = false;
    let visible     = false;
    let raf;

    const updateScale = () => {
      scaleTarget = isClicking ? 0.72 : isHovering ? 1.3 : 1.0;
    };

    const show = (v) => {
      visible = v;
      const op = v ? '1' : '0';
      if (dotRef.current)     dotRef.current.style.opacity     = op;
      if (ringPosRef.current) ringPosRef.current.style.opacity = op;
    };

    const onMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; if (!visible) show(true); };
    const onDown  = () => { isClicking = true;  updateScale(); };
    const onUp    = () => { isClicking = false; updateScale(); };
    const onLeave = () => show(false);
    const onEnter = () => show(true);

    const onOver = (e) => {
      if (!e.target.closest('a, button, [data-cursor-hover]')) return;
      isHovering = true;
      updateScale();
      if (ringSclRef.current)
        ringSclRef.current.style.borderColor = 'rgba(var(--accent-rgb), 0.78)';
    };

    const onOut = (e) => {
      if (!e.target.closest('a, button, [data-cursor-hover]')) return;
      isHovering = false;
      updateScale();
      if (ringSclRef.current)
        ringSclRef.current.style.borderColor = 'rgba(var(--accent-rgb), 0.45)';
    };

    // Magnetic pull
    const onMagMove = (e) => {
      const el = e.target.closest('[data-magnetic]');
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      el.style.transform  = `translate(${(e.clientX - cx) * 0.28}px, ${(e.clientY - cy) * 0.28}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    };

    const onMagOut = (e) => {
      const el = e.target.closest('[data-magnetic]');
      if (!el) return;
      el.style.transform  = 'translate(0, 0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    };

    // RAF spring loop
    const animate = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.1;
      ringPos.y += (mouse.y - ringPos.y) * 0.1;
      scaleCur  += (scaleTarget - scaleCur) * 0.13;
      dotOp.val += ((isHovering ? 0.35 : 1.0) - dotOp.val) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.x - 3}px, ${mouse.y - 3}px)`;
        dotRef.current.style.opacity   = String(dotOp.val.toFixed(3));
      }
      if (ringPosRef.current) {
        ringPosRef.current.style.transform =
          `translate(${(ringPos.x - 18).toFixed(2)}px, ${(ringPos.y - 18).toFixed(2)}px)`;
      }
      if (ringSclRef.current) {
        ringSclRef.current.style.transform = `scale(${scaleCur.toFixed(3)})`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('mousemove',    onMove,   { passive: true });
    window.addEventListener('mousedown',    onDown);
    window.addEventListener('mouseup',      onUp);
    window.addEventListener('mouseover',    onOver,   { passive: true });
    window.addEventListener('mouseout',     onOut,    { passive: true });
    window.addEventListener('mousemove',    onMagMove, { passive: true });
    window.addEventListener('mouseout',     onMagOut, { capture: true, passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      if (document.head.contains(style)) document.head.removeChild(style);
      window.removeEventListener('mousemove',    onMove);
      window.removeEventListener('mousedown',    onDown);
      window.removeEventListener('mouseup',      onUp);
      window.removeEventListener('mouseover',    onOver);
      window.removeEventListener('mouseout',     onOut);
      window.removeEventListener('mousemove',    onMagMove);
      window.removeEventListener('mouseout',     onMagOut, { capture: true });
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         6,
          height:        6,
          background:    'var(--accent)',
          borderRadius:  '50%',
          pointerEvents: 'none',
          zIndex:        9999,
          mixBlendMode:  'screen',
          opacity:       0,
          willChange:    'transform',
        }}
      />

      {/* Ring position wrapper */}
      <div
        ref={ringPosRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          pointerEvents: 'none',
          zIndex:        9998,
          opacity:       0,
          willChange:    'transform',
        }}
      >
        {/* Ring scale wrapper */}
        <div
          ref={ringSclRef}
          style={{
            width:        36,
            height:       36,
            border:       '1.5px solid rgba(var(--accent-rgb), 0.45)',
            borderRadius: '50%',
            willChange:   'transform',
            transition:   'border-color 0.2s',
          }}
        />
      </div>
    </>
  );
}
