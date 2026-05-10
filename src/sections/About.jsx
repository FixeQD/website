import { me, achievements, skills } from "../data";
import { bridge } from "../utils/bridge";
import { useGithubStats } from "../hooks";
import { parseMarkdown } from "../utils/markdown";

const glass = {
  background: "rgba(6,6,9,0.62)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "14px",
};

export default function AboutContent({ progress }) {
  const onInteraction = () => bridge.emit("hover");
  const { stats, loading } = useGithubStats("FixeQD");

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
      <div style={{ width: "100%", maxWidth: 1100 }}>
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

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "1.25rem",
          alignItems: "start",
        }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* main panel */}
            <div style={{ ...glass, padding: "2rem" }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "1rem",
              color: "#9090b0",
              lineHeight: 1.75,
              maxWidth: 620,
            }}
          >
            {parseMarkdown(me.bio)}
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
        <div style={{ ...glass, padding: "1.5rem" }}>
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
      </div>

      {/* Right Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* github stats */}
        {!loading && stats && (
          <div style={{ ...glass, padding: "1.5rem" }}>
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.68rem",
                color: "#52526e",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1.2rem",
              }}
            >
              github activity
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                { label: 'Contributions', value: stats.contributions },
                { label: 'Commits', value: stats.commits },
                { label: 'Stars', value: stats.stars }
              ].map(item => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  padding: "0.85rem 0.5rem",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.15rem",
                  }}>
                    {item.value ?? '-'}
                  </div>
                  <div style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.7rem",
                    color: "#52526e",
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {stats.topLanguages && stats.topLanguages.length > 0 && (
              <div>
                <div style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.75rem",
                  color: "#52526e",
                  marginBottom: "0.6rem",
                }}>
                  Top Languages
                </div>
                
                <div style={{
                  display: "flex",
                  height: "6px",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: "0.8rem",
                }}>
                  {stats.topLanguages.map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percent}%`,
                        background: lang.color,
                        transition: "width 0.7s ease",
                      }}
                    />
                  ))}
                </div>

                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  rowGap: "0.5rem",
                }}>
                  {stats.topLanguages.map(lang => (
                    <div key={lang.name} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: lang.color,
                      }} />
                      <span style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.75rem",
                        color: "#9090b0",
                      }}>
                        {lang.name}
                      </span>
                      <span style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "0.7rem",
                        color: "#52526e",
                      }}>
                        {lang.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* achievements */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
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
                {parseMarkdown(a.title)}
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
                {parseMarkdown(a.desc)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
