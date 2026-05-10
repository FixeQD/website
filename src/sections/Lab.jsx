import { useEffect, useRef } from "react";
import { bridge } from "../utils/bridge";

const glass = {
  background: "rgba(6,6,9,0.5)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
};

export default function LabContent({ progress }) {
  const onInteraction = () => bridge.emit("hover");
  const scrambleRef = useRef(null);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!@#$%^&*()";
    const int = setInterval(() => {
      if (Math.random() > 0.2 && scrambleRef.current) {
        let str = "";
        for (let i = 0; i < 22; i++) {
          str += chars[Math.floor(Math.random() * chars.length)];
        }
        scrambleRef.current.textContent = "> " + str;
      }
    }, 80);
    return () => clearInterval(int);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        opacity: "var(--opacity-3, 0)",
        transform: "translateY(var(--translate-3, 0px))",
        pointerEvents: "var(--events-3, none)",
      }}
    >
      <div
        onMouseEnter={onInteraction}
        style={{
          ...glass,
          width: "100%",
          maxWidth: 640,
          padding: "clamp(2rem, 5vw, 3.5rem)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-10%",
            width: "120%",
            height: "150%",
            background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb), 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: "1.5rem",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.68rem",
                color: "var(--accent)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "0.6rem",
              }}
            >
              Lab
            </div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Project X
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(var(--accent-rgb), 0.08)",
              border: "1px solid rgba(var(--accent-rgb), 0.2)",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                animation: "pulse-dot 1.6s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.65rem",
                color: "var(--accent)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              In Progress
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: "relative", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "#9090b0",
              lineHeight: 1.75,
              marginBottom: "1.8rem",
            }}
          >
            I'm currently building something that doesn't quite fit on a standard resume. It's experimental, heavily optimized, and highly classified until it's ready to see the light of day.
          </p>

          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.82rem",
              color: "#4a4a6a",
              background: "rgba(0,0,0,0.4)",
              padding: "1.2rem",
              borderRadius: "8px",
              border: "1px dashed rgba(255,255,255,0.06)",
              wordBreak: "break-all",
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: "var(--accent)", opacity: 0.8 }}>$ tail -f /dev/lab/status</span>
            <br />
            <br />
            <span style={{ color: "#686888" }}>[WARN]</span> Data encrypted.
            <br />
            <span style={{ color: "#686888" }}>[INFO]</span> Decoding stream...
            <br />
            <span ref={scrambleRef} style={{ color: "#e2e2f0", opacity: 0.9 }}>&gt; ENCRYPTED_PAYLOAD_0X9F</span>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.68rem",
            color: "#52526e",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            position: "relative",
          }}
        >
          <span>ETA: Unknown</span>
          <span>Trust the process</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.65rem",
          color: "#52526e",
        }}
      >
        <p style={{ marginBottom: "0.2rem" }}>
          &copy; {new Date().getFullYear()} Paweł Sobczak
        </p>
        <p>
          Built with React, Tailwind CSS &amp; Three.js and of course ❤️
        </p>
      </div>
    </div>
  );
}
