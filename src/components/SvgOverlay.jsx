import { useEffect, useRef } from 'react';

function Bracket({ position, size = 42, delay = 0 }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray  = len;
    el.style.strokeDashoffset = len;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
        el.style.strokeDashoffset = '0';
      });
    });
    return () => cancelAnimationFrame(id);
  }, [delay]);

  const s = size;
  const v = `0 0 ${s + 2} ${s + 2}`;

  // Each path forms an L with the corner at the screen edge
  const paths = {
    tl: `M ${s} 1 L 1 1 L 1 ${s}`,
    tr: `M 1 1 L ${s} 1 L ${s} ${s}`,
    bl: `M 1 1 L 1 ${s} L ${s} ${s}`,
    br: `M ${s} 1 L ${s} ${s} L 1 ${s}`,
  };

  const positions = {
    tl: { top: 12, left: 12 },
    tr: { top: 12, right: 12 },
    bl: { bottom: 12, left: 12 },
    br: { bottom: 12, right: 12 },
  };

  return (
    <svg
      width={s + 2}
      height={s + 2}
      viewBox={v}
      style={{ position: 'absolute', pointerEvents: 'none', ...positions[position] }}
    >
      <path
        ref={pathRef}
        d={paths[position]}
        fill="none"
        stroke="rgba(var(--accent-rgb), 0.3)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SvgOverlay() {
  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      pointerEvents: 'none',
      zIndex:        5,
    }}>
      <Bracket position="tl" delay={150} />
      <Bracket position="tr" delay={300} />
      <Bracket position="bl" delay={450} />
      <Bracket position="br" delay={600} />
    </div>
  );
}
