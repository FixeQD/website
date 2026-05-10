import { useEffect, useRef, useState } from "react";

let targetProgress = 0;
let currentProgress = 0;
let isInitialized = false;

const refs = new Set();
const setters = new Set();

function updateTarget() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  targetProgress = max > 0 ? window.scrollY / max : 0;
}

function tick() {
  const diff = targetProgress - currentProgress;
  const maxSpd = 0.0035;

  if (Math.abs(diff) > maxSpd) {
    currentProgress += Math.sign(diff) * maxSpd;
  } else {
    currentProgress += diff * 0.15;
  }

  if (Math.abs(diff) > 0.00005) {
    refs.forEach((ref) => { ref.current = currentProgress; });
    setters.forEach((set) => set(currentProgress));
  }

  requestAnimationFrame(tick);
}

function init() {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;
  window.addEventListener("scroll", updateTarget, { passive: true });
  updateTarget();
  currentProgress = targetProgress;
  requestAnimationFrame(tick);
}

export function useScrollProgress() {
  init();
  const ref = useRef(currentProgress);
  useEffect(() => {
    refs.add(ref);
    return () => refs.delete(ref);
  }, []);
  return ref;
}

export function useScrollProgressState() {
  init();
  const [p, setP] = useState(currentProgress);
  useEffect(() => {
    setters.add(setP);
    return () => setters.delete(setP);
  }, []);
  return p;
}

export function useReducedMotion() {
  const [v, set] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = (e) => set(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return v;
}

const API_BASE = "https://github-readme-stats.fixeq.me/api/json";

export function useGithubStats(username) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?username=${username}`);
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();

      const total = data.contributesLanguage?.reduce((sum, l) => sum + l.contributions, 0) ?? 0;

      const topLanguages = (data.contributesLanguage ?? []).slice(0, 5).map((l) => ({
        name: l.language,
        color: l.color,
        percent: total > 0 ? Math.round((l.contributions / total) * 100) : 0,
      }));

      setStats({
        contributions: data.totalContributions ?? 0,
        commits: data.totalCommitContributions ?? 0,
        stars: data.totalStargazerCount ?? 0,
        topLanguages,
      });
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchStats();
    }
  }, [username]);

  return { stats, loading, fetch: fetchStats };
}
