import { useEffect, useRef, useState } from "react";
import { me, socials, typewriterWords } from "../data";
import { bridge } from "../utils/bridge";
import { parseMarkdown } from "../utils/markdown";

function useTypewriter(words) {
  const [text, setText] = useState("");
  const wordIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let t;
    const tick = () => {
      const word = words[wordIdx.current];
      if (deleting.current) {
        setText(word.slice(0, charIdx.current - 1));
        charIdx.current--;
      } else {
        setText(word.slice(0, charIdx.current + 1));
        charIdx.current++;
      }

      let delay = deleting.current ? 38 : 120;
      if (!deleting.current && charIdx.current === word.length) {
        delay = 2000;
        deleting.current = true;
      } else if (deleting.current && charIdx.current === 0) {
        deleting.current = false;
        wordIdx.current = (wordIdx.current + 1) % words.length;
        delay = 350;
      }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [words]);

  return text;
}

const SocialIcon = ({ social }) => {
  const icons = {
    github: (
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    ),
    discord: (
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.12 18.17.14 18.282.18 18.392a19.916 19.916 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    ),
    instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    ),
  };
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      title={social.name}
      style={{
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        color: "#52526e",
        textDecoration: "none",
        transition: "color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#e2e2f0";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#52526e";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
        {icons[social.icon]}
      </svg>
    </a>
  );
};

export default function Hero() {
  const word = useTypewriter(typewriterWords);

  const onInteraction = () => bridge.emit("hover");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        padding: "0 2rem",
        opacity: "var(--opacity-0, 0)",
        transform: "translateY(var(--translate-0, 0px))",
        pointerEvents: "var(--events-0, none)",
      }}
    >
      <div style={{ marginLeft: "max(1rem, 5vw)", maxWidth: 560 }}>
        {/* typewriter */}
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.82rem",
            color: "var(--accent)",
            marginBottom: "1.4rem",
            minHeight: "1.2rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {parseMarkdown(word)}
          <span className="cursor" />
        </div>

        {/* headline */}
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 11vw, 5rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            marginBottom: "1.4rem",
          }}
        >
          I build things
          <br />
          <span
            style={{
              background: "linear-gradient(95deg, var(--accent) 10%, #7b2fff 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            for the web.
          </span>
        </h1>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1rem",
            color: "#7a7a96",
            lineHeight: 1.7,
            maxWidth: 420,
            marginBottom: "2.4rem",
          }}
        >
          {parseMarkdown(me.shortBio)}
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight * 1.25,
                behavior: "smooth",
              })
            }
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              fontSize: "0.88rem",
              background: "var(--accent)",
              color: "#060609",
              border: "none",
              padding: "0.7rem 1.6rem",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.82";
              onInteraction();
            }}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            See my work
          </button>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            {socials.map((s) => (
              <SocialIcon key={s.name} social={s} />
            ))}
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: "2.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          opacity: "calc(var(--opacity-0, 0) * 0.6)",
        }}
      >
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.6rem",
            color: "#52526e",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          scroll
        </span>
        <div
          style={{
            width: 1,
            height: 38,
            background: "linear-gradient(to bottom, rgba(var(--accent-rgb), 0.53), transparent)",
          }}
        />
      </div>
    </div>
  );
}
