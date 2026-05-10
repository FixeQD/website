import { bridge } from "../utils/bridge";

export default function LabContent({ progress }) {
  const onInteraction = () => bridge.emit("hover");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "5rem 2rem 2rem",
        opacity: "var(--opacity-3, 0)",
        transform: "translateY(var(--translate-3, 0px))",
        pointerEvents: "var(--events-3, none)",
      }}
    >
      <div>
        {/* live badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid rgba(var(--accent-rgb), 0.22)',
          borderRadius: '100px',
          padding: '0.3rem 0.9rem',
          marginBottom: '2.5rem',
        }}
        onMouseEnter={onInteraction}
        >
          <span style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            animation: 'pulse-dot 1.6s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.68rem',
            color: 'var(--accent)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            in the lab
          </span>
        </div>

        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 8vw, 6.5rem)',
          letterSpacing: '-0.045em',
          lineHeight: 0.95,
          marginBottom: '1.5rem',
        }}>
          Actually
          <br />
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(100deg, var(--accent) 0%, #7b2fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            cooking
          </span>
          <br />
          something
        </h2>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.95rem',
          color: '#52526e',
          maxWidth: 360,
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          Not ready to talk about it yet. But it's real, it's moving, and when it drops you'll know.
        </p>

        <p style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.72rem',
          color: '#3a3a52',
          letterSpacing: '0.1em',
        }}>
          ETA unknown. trust the process.
        </p>
      </div>
    </div>
  )
}
