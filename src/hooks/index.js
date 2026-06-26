import { useEffect, useRef, useState } from "react";

let targetProgress = 0;
let currentProgress = 0;
let isInitialized = false;

const refs = new Set();
const setters = new Set();

const HUB_PROGS = [1 / 3, 2 / 3, 1.0];

const SLOW_RADIUS = 0.09;
const MIN_SPEED = 0.18;
const SCROLL_IDLE_MS = 150;

let lastScrollTime = 0;

function speedFactor(current, target) {
  // Only slow when scrolling forward.
  if (target <= current) return 1;

  for (const hp of HUB_PROGS) {
    const dist = hp - current; // positive = hub is ahead
    if (dist > 0 && dist < SLOW_RADIUS) {
      const t = dist / SLOW_RADIUS;
      return MIN_SPEED + (1 - MIN_SPEED) * (t * t);
    }
  }
  return 1;
}

function updateTarget() {
  lastScrollTime = Date.now();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  targetProgress = max > 0 ? window.scrollY / max : 0;
}

function tick() {
  const diff = targetProgress - currentProgress;
  const factor = speedFactor(currentProgress, targetProgress);
  const isIdle = (Date.now() - lastScrollTime) > SCROLL_IDLE_MS;

  // In a slow zone with no active scrolling -> drift to the hub it's approaching
  if (factor < 1 && isIdle) {
    const snapTarget = HUB_PROGS.find((hp) => hp >= currentProgress) ?? currentProgress;
    const snapDiff = snapTarget - currentProgress;
    if (Math.abs(snapDiff) > 0.00005) {
      currentProgress += snapDiff * 0.06;
      refs.forEach((ref) => { ref.current = currentProgress; });
      setters.forEach((set) => set(currentProgress));
    }
    requestAnimationFrame(tick);
    return;
  }

  const maxSpd = 0.0035 * factor;

  if (Math.abs(diff) > maxSpd) {
    currentProgress += Math.sign(diff) * maxSpd;
  } else {
    currentProgress += diff * 0.15 * factor;
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

  useEffect(() => {
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

    if (username) {
      fetchStats();
    }
  }, [username]);

  return { stats, loading };
}
