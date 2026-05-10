import { useState } from "react";
import { projects } from "../data";
import { bridge } from "../utils/bridge";

const glass = {
  background: "rgba(6,6,9,0.62)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "14px",
};

function ProjectCard({ project, onHover }) {
  const [hovered, setHovered] = useState(false);

  const onEnter = () => {
    setHovered(true);
    onHover?.();
  };

  const Component = project.url ? "a" : "div";

  return (
    <Component
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
      onFocus={onEnter}
      onBlur={() => setHovered(false)}
      href={project.url}
      target={project.url ? "_blank" : undefined}
      rel={project.url ? "noopener noreferrer" : undefined}
      style={{
        ...glass,
        padding: "1.75rem",
        cursor: project.url ? "pointer" : "default",
        transition: "border-color 0.25s, transform 0.25s",
        borderColor: hovered ? `${project.color}55` : "rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-2px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        textDecoration: "none",
        color: "inherit",
        outline: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: hovered ? "#e2e2f0" : "#c2c2d8",
            transition: "color 0.2s",
            lineHeight: 1.2,
          }}
        >
          {project.name}
        </h3>

        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
          {project.wip && (
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "0.62rem",
                color: "#ff6b35",
                border: "1px solid #ff6b3555",
                borderRadius: "3px",
                padding: "0.15rem 0.45rem",
                whiteSpace: "nowrap",
              }}
            >
              WIP
            </span>
          )}
          {project.url && (
            <span
              style={{
                color: "#52526e",
                fontSize: "0.85rem",
                transition: "color 0.2s",
                ...(hovered ? { color: "var(--accent)" } : {}),
              }}
            >
              ↗
            </span>
          )}
        </div>
      </div>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.85rem",
          color: "#68688a",
          lineHeight: 1.65,
          flex: 1,
        }}
      >
        {project.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.68rem",
              color: "#52526e",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "3px",
              padding: "0.18rem 0.5rem",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Component>
  );
}

export default function Projects() {
  const onInteraction = () => bridge.emit("hover");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem 2rem",
        opacity: "var(--opacity-2, 0)",
        transform: "translateY(var(--translate-2, 0px))",
        pointerEvents: "var(--events-2, none)",
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
          projects
        </span>

        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            letterSpacing: "-0.025em",
            marginBottom: "2rem",
            lineHeight: 1.1,
          }}
        >
          Things I've shipped
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1rem",
          }}
        >
          {projects.map((p) => (
            <ProjectCard key={p.name} project={p} onHover={onInteraction} />
          ))}
        </div>

        <p
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.72rem",
            color: "#3a3a52",
            marginTop: "1.5rem",
          }}
        >
          // more on GitHub
        </p>
      </div>
    </div>
  );
}
