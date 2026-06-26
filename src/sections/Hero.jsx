import { useEffect, useRef, useState } from "react";
import { me, socials, typewriterWords } from "../data";
import { bridge } from "../utils/bridge";
import { parseMarkdown } from "../utils/markdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'

function useTypewriter(words) {
  const [text, setText] = useState("");
  const wordIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (!Array.isArray(words) || words.length === 0) {
      setText("");
      return;
    }
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
      <div style={{ marginLeft: "max(2rem, 8vw)", maxWidth: 720 }}>
        {/* typewriter */}
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.9rem",
            color: "var(--accent)",
            marginBottom: "1.6rem",
            minHeight: "1.4rem",
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
            fontSize: "clamp(2.8rem, 12vw, 6.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            marginBottom: "1.6rem",
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
            data-magnetic
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
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                aria-label={`Visit ${s.name}`}
                data-magnetic
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
                <FontAwesomeIcon icon={fab[s.icon]} size="lg" />
              </a>
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
        <svg
          width={16}
          height={12}
          viewBox="0 0 16 12"
          fill="none"
          style={{
            color: "rgba(var(--accent-rgb), 0.5)",
            animation: "bounce-down 1.8s ease-in-out infinite",
          }}
        >
          <path d="M1 1l7 7 7-7" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 5l7 7 7-7" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
        </svg>
      </div>
    </div>
  );
}
