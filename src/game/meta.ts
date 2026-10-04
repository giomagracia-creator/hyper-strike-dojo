export type Mode = "duel" | "survival" | "speed" | "chaos";
export type TrailId = "spark" | "comet" | "ribbon";
export type SkinId = "classic" | "candy" | "void";
export type ThemeId = "arcade" | "soft" | "crunch";

export type BoardRow = { name: string; score: number; mode: Mode };

export type Challenge = {
  id: "rally" | "pickups" | "score" | "spikes";
  label: string;
  goal: number;
  progress: number;
  done: boolean;
  day: string;
};

export type Meta = {
  xp: number;
  trail: TrailId;
  skin: SkinId;
  theme: ThemeId;
  board: BoardRow[];
  challenge: Challenge;
};

const KEY = "hyper-strike-meta";
const STEP = 250;

const CHALLENGES: { id: Challenge["id"]; label: string; goal: number }[] = [
  { id: "rally", label: "Land a 15-hit rally", goal: 15 },
  { id: "pickups", label: "Collect 5 power-ups in one game", goal: 5 },
  { id: "score", label: "Score 2,500 in one game", goal: 2500 },
  { id: "spikes", label: "Land 4 spikes in one game", goal: 4 },
];

export const MODE_LABEL: Record<Mode, string> = {
  duel: "Duel",
  survival: "Survival",
  speed: "Sprint",
  chaos: "Chaos",
};

export function levelOf(xp: number) {
  return 1 + Math.floor(Math.max(0, xp) / STEP);
}

export function xpSlice(xp: number) {
  const into = Math.max(0, xp) % STEP;
  return { level: levelOf(xp), have: into, need: STEP };
}

export function owned(level: number) {
  return {
    trails: (["spark", "comet", "ribbon"] as TrailId[]).filter((_, i) => level >= [1, 2, 5][i]),
    skins: (["classic", "candy", "void"] as SkinId[]).filter((_, i) => level >= [1, 3, 6][i]),
    themes: (["arcade", "soft", "crunch"] as ThemeId[]).filter((_, i) => level >= [1, 4, 7][i]),
  };
}

export function unlockNames(prevLevel: number, nextLevel: number) {
  const before = owned(prevLevel);
  const after = owned(nextLevel);
  const names: string[] = [];
  for (const id of after.trails) if (!before.trails.includes(id) && id !== "spark") names.push(`${id} trail`);
  for (const id of after.skins) if (!before.skins.includes(id) && id !== "classic") names.push(`${id} paddle`);
  for (const id of after.themes) if (!before.themes.includes(id) && id !== "arcade") names.push(`${id} sounds`);
  return names;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function freshChallenge(day = today()): Challenge {
  const pick = CHALLENGES[Math.abs(hash(day)) % CHALLENGES.length];
  return { ...pick, progress: 0, done: false, day };
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0;
  return h;
}

export function defaultMeta(): Meta {
  return { xp: 0, trail: "spark", skin: "classic", theme: "arcade", board: [], challenge: freshChallenge() };
}

export function loadMeta(): Meta {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultMeta();
    const parsed = JSON.parse(raw) as Meta;
    const base = defaultMeta();
    const day = today();
    const challenge = parsed.challenge?.day === day ? parsed.challenge : freshChallenge(day);
    return {
      xp: Number(parsed.xp) || 0,
      trail: parsed.trail || "spark",
      skin: parsed.skin || "classic",
      theme: parsed.theme || "arcade",
      board: Array.isArray(parsed.board) ? parsed.board.slice(0, 5) : [],
      challenge: challenge || base.challenge,
    };
  } catch {
    return defaultMeta();
  }
}

export function saveMeta(meta: Meta) {
  try {
    localStorage.setItem(KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

export function grantXp(meta: Meta, score: number, won: boolean) {
  const prev = levelOf(meta.xp);
  const gain = Math.round(score / 8) + (won ? 50 : 15);
  meta.xp += gain;
  const level = levelOf(meta.xp);
  return { gain, level, unlocked: unlockNames(prev, level), slice: xpSlice(meta.xp) };
}

export function noteChallenge(meta: Meta, kind: Challenge["id"], value: number) {
  const ch = meta.challenge;
  if (ch.day !== today()) meta.challenge = freshChallenge();
  if (meta.challenge.id !== kind || meta.challenge.done) return meta.challenge;
  meta.challenge.progress = Math.max(meta.challenge.progress, value);
  meta.challenge.done = meta.challenge.progress >= meta.challenge.goal;
  return meta.challenge;
}

export function qualifies(board: BoardRow[], score: number) {
  if (score < 100) return false;
  if (board.length < 5) return true;
  return score > board[board.length - 1].score;
}

export function pushScore(board: BoardRow[], row: BoardRow) {
  const next = [...board, row].sort((a, b) => b.score - a.score).slice(0, 5);
  return next;
}
