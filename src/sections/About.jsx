import { me, achievements, skills } from "../data";
import { bridge } from "../utils/bridge";

const glass = {
  background: "rgba(6,6,9,0.62)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "14px",
};

export default function AboutContent({ progress }) {
  const onInteraction = () => bridge.emit("hover");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem 2rem",
        opacity: "var(--opacity-1, 0)",
        transform: "translateY(var(--translate-1, 0px))",
        pointerEvents: "var(--events-1, none)",
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", maxWidth: 860 }}>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.72rem",
            color: "var(--accent)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "0.9rem",
          }}
        >
          about
        </span>

        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            letterSpacing: "-0.025em",
            marginBottom: "1.8rem",
            lineHeight: 1.1,
          }}
        >
          The longer version
        </h2>

        {/* main panel */}
        <div style={{ ...glass, padding: "2rem", marginBottom: "1.25rem" }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "#9090b0",
              lineHeight: 1.75,
              maxWidth: 620,
            }}
          >
            {me.bio}
          </p>

          {/* stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginTop: "1.75rem",
              paddingTop: "1.75rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {me.stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.78rem",
                    color: "#52526e",
                    marginTop: "0.2rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* skills */}
        <div style={{ ...glass, padding: "1.5rem", marginBottom: "1.25rem" }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.68rem",
              color: "#52526e",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            tech I use
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skills.map((skill) => (
              <span
                key={skill.name}
                onMouseEnter={onInteraction}
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "5px",
                  border: `1px solid ${skill.color}44`,
                  color: skill.color,
                  background: `${skill.color}0d`,
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* achievements */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {achievements.map((a) => (
            <div
              key={a.title}
              style={{
                ...glass,
                padding: "1.1rem 1.25rem",
                borderLeft: `3px solid ${a.color}`,
              }}
            >
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "0.4rem",
                  color: "#e2e2f0",
                }}
              >
                {a.title}
              </div>
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.8rem",
                  color: "#6868888",
                  lineHeight: 1.55,
                  color: "#7070906",
                }}
              >
                {a.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
