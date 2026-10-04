import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ChevronLeft, ChevronRight, Pause, Volume2, VolumeX, Vibrate } from "lucide-react";
import {
  CHIP_LABEL,
  HyperStrikeGame,
  prizeLine,
  type Hud,
  type Labels,
  type Mode,
  type Result,
  type Snapshot,
  type Tone,
} from "@/game/hyper-strike-engine";
import { MODE_LABEL, loadMeta, owned, pushScore, saveMeta, type Meta } from "@/game/meta";

declare global {
  interface Window {
    __hyper?: {
      setKeys: (codes: string[]) => void;
      snapshot: () => Snapshot;
      debugStrike: (edge: boolean) => void;
      debugShield: () => void;
      start: (ai: boolean) => void;
    };
  }
}

const TONE: Record<Tone, string> = {
  cyan: "var(--color-cyan)",
  magenta: "var(--color-magenta)",
  amber: "var(--color-amber)",
  fg: "var(--color-fg)",
};

const REQUEST_URL = "https://www.codeninjas.com/central-edmonton-ab-ca/create";
const TOUR_URL = "https://www.codeninjas.com/central-edmonton-ab-ca/schedule-tour";
const MAPS_URL = "https://maps.app.goo.gl/DSrZuGJ2nLEz2n616?g_st=ac";

function useCabinet(
  active: boolean,
  onAction: (action: "up" | "down" | "left" | "right" | "press" | "back") => void,
) {
  const actionRef = useRef(onAction);
  actionRef.current = onAction;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const action =
        e.code === "ArrowUp" || e.code === "KeyW"
          ? "up"
          : e.code === "ArrowDown" || e.code === "KeyS"
            ? "down"
            : e.code === "ArrowLeft" || e.code === "KeyA"
              ? "left"
              : e.code === "ArrowRight" || e.code === "KeyD"
                ? "right"
                : e.code === "Enter" || e.code === "Space" || e.code === "KeyZ"
                  ? "press"
                  : e.code === "Escape" || e.code === "KeyX" || e.code === "Backspace"
                    ? "back"
                    : null;
      if (!action || e.repeat) return;
      e.preventDefault();
      e.stopPropagation();
      actionRef.current(action);
    };
    window.addEventListener("keydown", onKey, true);
    let frame = 0;
    let hold = "";
    let holdAt = 0;
    let prevA = false;
    let prevB = false;
    const poll = (now: number) => {
      const pads = navigator.getGamepads?.();
      const pad = pads ? Array.from(pads).find((item) => item && item.connected) : null;
      if (pad) {
        let dir = "";
        const ax = pad.axes[0] ?? 0;
        const ay = pad.axes[1] ?? 0;
        if (pad.buttons[12]?.pressed || ay < -0.55) dir = "up";
        else if (pad.buttons[13]?.pressed || ay > 0.55) dir = "down";
        else if (pad.buttons[14]?.pressed || ax < -0.55) dir = "left";
        else if (pad.buttons[15]?.pressed || ax > 0.55) dir = "right";
        if (dir && (dir !== hold || now - holdAt > 220)) {
          hold = dir;
          holdAt = now;
          actionRef.current(dir as "up" | "down" | "left" | "right");
        }
        if (!dir) hold = "";
        const a = !!pad.buttons[0]?.pressed;
        const b = !!pad.buttons[1]?.pressed;
        if (a && !prevA) actionRef.current("press");
        if (b && !prevB) actionRef.current("back");
        prevA = a;
        prevB = b;
      }
      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      cancelAnimationFrame(frame);
    };
  }, [active]);
}

function stickRing(on: boolean) {
  return on ? "outline outline-2 outline-offset-2 outline-amber" : "";
}

function ParentLinks({ quiet, hot }: { quiet?: boolean; hot: string }) {
  return (
    <div className={quiet ? "mt-2" : "mt-3"}>
      <a
        href={REQUEST_URL}
        data-stick="book"
        target="_blank"
        rel="noreferrer"
        className={`block w-full text-center text-sm font-semibold text-muted underline decoration-border underline-offset-4 ${stickRing(hot === "book")}`}
      >
        Request info
      </a>
      <a
        href={MAPS_URL}
        data-stick="map"
        target="_blank"
        rel="noreferrer"
        className={`mt-1 block text-center text-xs font-semibold text-muted underline decoration-border underline-offset-4 ${stickRing(hot === "map")}`}
      >
        Code Ninjas Central Edmonton
      </a>
    </div>
  );
}

function CloseX({ onClick, hot, light }: { onClick: () => void; hot?: boolean; light?: boolean }) {
  return (
    <button
      type="button"
      aria-label="Close"
      data-stick="close"
      onClick={onClick}
      className={`absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full border text-lg leading-none font-bold ${light ? "border-[#d5dbe3] bg-white text-[#111]" : "border-border text-fg"} ${stickRing(!!hot)}`}
    >
      ×
    </button>
  );
}

function BrandFrame({
  onClose,
  hotClose,
  unfold,
  children,
}: {
  onClose: () => void;
  hotClose: boolean;
  unfold?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg/80 px-4" style={{ perspective: "1200px" }}>
      <div className={`cn-card relative w-full max-w-sm overflow-hidden rounded-3xl bg-white px-5 pt-12 pb-6 text-center shadow-2xl ${unfold ? "cn-unfold" : ""}`}>
        <span className="cn-wave cn-wave-tr" aria-hidden />
        <span className="cn-wave cn-wave-tr2" aria-hidden />
        <span className="cn-wave cn-wave-bl" aria-hidden />
        <CloseX light hot={hotClose} onClick={onClose} />
        <div className="relative z-10 mx-auto w-full max-w-[280px]">
          <img src="/code-ninjas-logo.png" alt="Code Ninjas" className="h-auto w-full" />
          <p className="mt-1 ml-[22%] text-[11px] font-bold tracking-[0.16em] text-black">CENTRAL EDMONTON, AB</p>
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

function RequestCard({ hot, onClose }: { hot: string; onClose: () => void }) {
  return (
    <BrandFrame onClose={onClose} hotClose={hot === "close"}>
      <h2 className="mt-4 text-[1.65rem] leading-tight font-bold text-[#338fbf]">For a parent</h2>
      <p className="mt-1 text-sm text-[#424244]">The game stays here. Request info opens the Code Ninjas® program.</p>
      <a
        href={REQUEST_URL}
        data-stick="request"
        target="_blank"
        rel="noreferrer"
        className={`mt-4 flex h-12 items-center justify-center rounded-md bg-[#338fbf] text-sm font-bold text-white ${stickRing(hot === "request")}`}
      >
        Request info
      </a>
    </BrandFrame>
  );
}

function PackReveal({
  hot,
  go,
  onStart,
  onDone,
  onClose,
}: {
  hot: string;
  go: boolean;
  onStart: () => void;
  onDone: () => void;
  onClose: () => void;
}) {
  const [rip, setRip] = useState(0);
  const doneRef = useRef(false);
  const dragRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  function finish(next: number) {
    if (next >= 1 && !doneRef.current) {
      doneRef.current = true;
      onDoneRef.current();
    }
    return Math.min(1, next);
  }

  useEffect(() => {
    if (!go || doneRef.current) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setRip((value) => finish(value + dt * 0.7));
      if (!doneRef.current) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [go]);

  if (rip >= 1) {
    return (
      <BrandFrame onClose={onClose} hotClose={hot === "close"} unfold>
        <h2 className="mt-4 text-[1.45rem] leading-tight font-bold text-[#111]">
          Claim your prize at Code Ninjas® + build and keep your own videogame
        </h2>
        <a
          href={TOUR_URL}
          data-stick="tour"
          target="_blank"
          rel="noreferrer"
          className={`mt-4 flex min-h-12 items-center justify-center rounded-md bg-[#338fbf] px-3 py-2 text-center text-sm leading-tight font-bold text-white ${stickRing(hot === "tour")}`}
        >
          Book your free game building session here
        </a>
        <a
          href={MAPS_URL}
          data-stick="map"
          target="_blank"
          rel="noreferrer"
          className={`mt-2 flex h-12 items-center justify-center rounded-md border-2 border-[#338fbf] bg-white text-sm font-bold text-[#338fbf] ${stickRing(hot === "map")}`}
        >
          Map to Code Ninjas
        </a>
      </BrandFrame>
    );
  }

  const open = rip * 46;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg/80 px-4">
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-surface p-5 pt-12 text-center shadow-2xl">
        <CloseX hot={hot === "close"} onClick={onClose} />
        <h2 className="font-display text-2xl font-extrabold tracking-wide text-fg">Rip the pack</h2>
        <p className="mt-1 text-sm text-muted">Drag down, or hold the button.</p>
        <div
          className="relative mx-auto mt-4 h-64 w-44 touch-none"
          onPointerDown={(e) => {
            dragRef.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
            onStart();
          }}
          onPointerMove={(e) => {
            if (dragRef.current == null) return;
            const pulled = Math.max(0, e.clientY - dragRef.current);
            setRip((value) => finish(Math.max(value, pulled / 160)));
          }}
          onPointerUp={() => {
            dragRef.current = null;
          }}
        >
          <div
            className="absolute inset-x-3 top-8 rounded-2xl border border-amber bg-amber/20 p-3 text-center"
            style={{ transform: `translateY(${(1 - rip) * 24}px) scale(${0.92 + rip * 0.08})`, opacity: 0.35 + rip * 0.65 }}
          >
            <p className="mt-8 text-xs font-extrabold tracking-[0.2em] text-amber">PRIZE</p>
          </div>
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-white/30 shadow-xl"
            style={{
              background: "repeating-linear-gradient(125deg, #123 0 10px, #1a3a4a 10px 14px, #3a1848 14px 22px, #123 22px 28px)",
              clipPath: `inset(0 0 ${open}% 0)`,
              transform: `translateY(${-rip * 36}px) rotate(${-rip * 6}deg)`,
            }}
          >
            <div className="mx-3 mt-3 h-3 rounded-sm bg-white/30" />
            <p className="mt-8 font-display text-xl font-extrabold tracking-wide text-white">HYPER PACK</p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-cyan">DOJO SEAL</p>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-2xl border-2 border-white/20"
            style={{
              height: `${open}%`,
              background: "repeating-linear-gradient(125deg, #0e2230 0 8px, #241232 8px 16px)",
              transform: `translateY(${rip * 28}px)`,
            }}
          />
        </div>
        <button
          type="button"
          data-stick="rip"
          onClick={onStart}
          className={`mt-4 h-12 w-full rounded-2xl border-2 border-amber bg-amber/15 text-sm font-extrabold text-fg ${stickRing(hot === "rip")}`}
        >
          Rip the pack
        </button>
      </div>
    </div>
  );
}

function paintRow(root: HTMLElement | null, hp: number, shields: number) {
  if (!root) return;
  const prev = Number(root.dataset.hp ?? hp);
  root.dataset.hp = String(hp);
  root.querySelectorAll<HTMLElement>("[data-pip]").forEach((el, i) => {
    const on = i < hp;
    el.dataset.on = on ? "1" : "0";
    if (prev > hp && i >= hp && i < prev) {
      el.animate([{ transform: "scale(1.45)" }, { transform: "scale(1)" }], { duration: 260 });
    }
  });
  root.querySelectorAll<HTMLElement>("[data-gem]").forEach((el, i) => {
    el.dataset.on = i < shields ? "1" : "0";
  });
  const num = root.querySelector<HTMLElement>("[data-hp-num]");
  if (!num) return;
  num.textContent = String(hp);
  num.classList.toggle("is-crit", hp === 1);
  if (prev !== hp) {
    num.animate([{ transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 220 });
  }
}

function ChipRow({ earned }: { earned: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
      {Object.entries(CHIP_LABEL).map(([id, label]) => {
        const on = earned.includes(id);
        return (
          <li
            key={id}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${on ? "border-amber bg-amber/15 text-amber" : "border-border text-muted"}`}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function Pips({ rowRef }: { rowRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={rowRef} className="flex min-w-0 flex-1 items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} data-pip data-on="1" className="heart" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>
      <svg data-gem className="shield-mark" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.1 20.4 5.2v6.4c0 4.7-3.3 7.8-7.9 9.8-.3.1-.7.1-1 0C6.9 19.4 3.6 16.3 3.6 11.6V5.2L12 2.1z" />
      </svg>
      <svg data-gem className="shield-mark" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.1 20.4 5.2v6.4c0 4.7-3.3 7.8-7.9 9.8-.3.1-.7.1-1 0C6.9 19.4 3.6 16.3 3.6 11.6V5.2L12 2.1z" />
      </svg>
      <span data-hp-num className="w-7 text-right font-display text-2xl leading-none font-extrabold">
        5
      </span>
    </div>
  );
}

export function HyperStrike() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<HyperStrikeGame | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const comboRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"menu" | "live" | "end">("menu");
  const [labels, setLabels] = useState<Labels>({ top: "BOT", bottom: "YOU" });
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState(0);
  const [coach, setCoach] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shake, setShake] = useState(true);
  const [easy, setEasy] = useState(true);
  const [wins, setWins] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [card, setCard] = useState(false);
  const [tip, setTip] = useState("");
  const [note, setNote] = useState("");
  const [tips, setTips] = useState(true);
  const [chips, setChips] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("duel");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [live, setLive] = useState({ score: 0, combo: 0, mul: 1 });
  const [initials, setInitials] = useState("");
  const [boardSaved, setBoardSaved] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [bookStep, setBookStep] = useState<"request" | "prize" | null>(null);
  const [packOpen, setPackOpen] = useState(false);
  const [ripGo, setRipGo] = useState(false);
  const [stick, setStick] = useState({ row: 2, col: 0 });
  const askedRef = useRef(false);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const game = new HyperStrikeGame(canvas, {
      onLive: (next) => {
        setLabels(next);
        setPhase("live");
      },
      onMenu: () => setPhase("menu"),
      onEnd: (next) => {
        setResult(next);
        setBest(next.best);
        setWins(next.wins);
        setChips(next.chips);
        setBoardSaved(false);
        setInitials("");
        setRounds((n) => n + 1);
        if (!askedRef.current) {
          askedRef.current = true;
          setBookStep("request");
        } else if (next.youWin && next.vsAI) {
          setBookStep("prize");
        }
        setPhase("end");
        setPaused(false);
      },
      shout: (text, tone, sub) => {
        const el = calloutRef.current;
        const subEl = subRef.current;
        if (!el) return;
        el.textContent = text;
        el.style.color = TONE[tone];
        el.style.opacity = "1";
        if (subEl) {
          subEl.textContent = sub;
          subEl.style.opacity = sub ? "1" : "0";
        }
        if (reduced) {
          window.setTimeout(() => {
            if (el.textContent === text) el.style.opacity = "0";
            if (subEl && subEl.textContent === sub) subEl.style.opacity = "0";
          }, 800);
          return;
        }
        el.animate(
          [
            { opacity: 1, transform: "scale(1.12)" },
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(0.96)" },
          ],
          { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" },
        );
        subEl?.animate([{ opacity: sub ? 1 : 0 }, { opacity: sub ? 1 : 0 }, { opacity: 0 }], {
          duration: 900,
          fill: "forwards",
        });
      },
      hud: (hud: Hud) => {
        paintRow(topRef.current, hud.p2hp, hud.p2shields);
        paintRow(botRef.current, hud.p1hp, hud.p1shields);
        const combo = comboRef.current;
        if (!combo) return;
        const show = hud.combo >= 2;
        const name = hud.combo >= 10 ? "LEGEND" : hud.combo >= 6 ? "BANANA" : hud.combo >= 3 ? "SWEET" : "";
        combo.textContent = show ? (name ? `${hud.combo} ${name}` : `${hud.combo} HIT`) : "";
        combo.style.opacity = show ? "1" : "0";
        combo.style.color = hud.hyper ? "var(--color-magenta)" : "var(--color-amber)";
        setLive({ score: hud.score, combo: hud.combo, mul: hud.mul });
      },
      coach: (on) => setCoach(on),
      card: (on) => setCard(on),
      ghost: (on) => setGhost(on),
      tip: (text) => setTip(text),
      note: (text) => {
        setNote(text);
        window.setTimeout(() => {
          setNote((cur) => (cur === text ? "" : cur));
        }, 2600);
      },
      pause: (on) => setPaused(on),
      prefs: (prefs) => {
        setMuted(prefs.muted);
        setShake(prefs.shake);
        setEasy(prefs.easy);
        setTips(prefs.tips);
      },
      quickStart: () => {
        game.unlock();
        game.start(true);
      },
      rematch: () => {
        game.unlock();
        game.start(game.versusAi);
      },
    });

    gameRef.current = game;
    window.__hyper = {
      setKeys: (codes) => game.setKeys(codes),
      snapshot: () => game.snapshot(),
      debugStrike: (edge) => game.debugStrike(edge),
      debugShield: () => game.debugShield(),
      start: (ai) => {
        game.unlock();
        game.start(ai);
      },
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) game.frame(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.visibilityState === "visible") game.unlock();
    };
    document.addEventListener("visibilitychange", onVis);

    try {
      setBest(Number(localStorage.getItem("hyper-strike-best") || 0) || 0);
      setWins(Number(localStorage.getItem("hyper-strike-wins") || 0) || 0);
      setEasy(localStorage.getItem("hyper-strike-easy") !== "0");
      setTips(localStorage.getItem("hyper-strike-tips") !== "0");
      setChips((localStorage.getItem("hyper-strike-chips") || "").split(",").filter(Boolean));
      const savedMode = localStorage.getItem("hyper-strike-mode");
      if (savedMode === "survival" || savedMode === "speed" || savedMode === "chaos" || savedMode === "duel") {
        setMode(savedMode);
      }
      setMeta(loadMeta());
    } catch {
      /* ignore */
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      game.destroy();
      gameRef.current = null;
      delete window.__hyper;
    };
  }, []);

  function play(ai: boolean) {
    const game = gameRef.current;
    if (!game) return;
    setBookStep(null);
    game.unlock();
    game.start(ai);
  }

  const lookIds = meta
    ? [
        ...owned(1 + Math.floor(meta.xp / 250)).trails.map((id) => `trail:${id}`),
        ...owned(1 + Math.floor(meta.xp / 250)).skins.map((id) => `skin:${id}`),
        ...owned(1 + Math.floor(meta.xp / 250)).themes.map((id) => `theme:${id}`),
      ]
    : [];
  const navRows: string[][] =
    bookStep === "request"
      ? [["request"], ["close"]]
      : bookStep === "prize"
        ? packOpen
          ? [["tour"], ["map"], ["close"]]
          : [["rip"]]
        : paused
            ? [["resume"], ["rematch-pause"], ["menu"], ["mute", "shake", "tips"], ["book", "map"]]
            : phase === "end"
              ? [
                  ...(result?.needsInitials && !boardSaved ? [["initials", "save"]] : []),
                  ["rematch"],
                  ...(rounds >= 2 ? [["book", "map"]] : []),
                  ["change"],
                  ["done"],
                ]
              : phase === "menu"
                ? [
                    ["mode:duel", "mode:survival", "mode:speed", "mode:chaos"],
                    ["easy", "spicy"],
                    ["play-bot"],
                    ["play-2p"],
                    ...(lookIds.length ? [lookIds] : []),
                    ["book", "map"],
                  ]
                : [];
  const rowItems = navRows[Math.min(stick.row, Math.max(0, navRows.length - 1))] ?? [];
  const activeId = rowItems[Math.min(stick.col, Math.max(0, rowItems.length - 1))] ?? "";
  const ring = (id: string) => stickRing(activeId === id);

  useEffect(() => {
    if (bookStep !== "prize") {
      setPackOpen(false);
      setRipGo(false);
    }
    if (bookStep || paused) setStick({ row: 0, col: 0 });
    else if (phase === "menu") setStick({ row: 2, col: 0 });
    else if (phase === "end") setStick({ row: result?.needsInitials && !boardSaved ? 1 : 0, col: 0 });
  }, [phase, paused, bookStep, packOpen, boardSaved, result?.needsInitials]);

  useEffect(() => {
    if (!activeId) return;
    const all = document.querySelectorAll<HTMLElement>(`[data-stick="${CSS.escape(activeId)}"]`);
    const el = all[all.length - 1];
    el?.scrollIntoView({ block: "nearest" });
    if (el && (el.tagName === "INPUT" || el.tagName === "SELECT")) el.focus();
  }, [activeId]);

  function activate(id: string) {
    if (id.startsWith("mode:")) {
      const next = id.slice(5) as Mode;
      setMode(next);
      gameRef.current?.setMode(next);
      return;
    }
    if (id.startsWith("trail:") || id.startsWith("skin:") || id.startsWith("theme:")) {
      const [kind, look] = id.split(":") as ["trail" | "skin" | "theme", string];
      gameRef.current?.setLook(kind, look);
      setMeta((prev) => (prev ? { ...prev, [kind]: look } : prev));
      return;
    }
    if (id === "easy") gameRef.current?.setEasy(true);
    else if (id === "spicy") gameRef.current?.setEasy(false);
    else if (id === "play-bot") play(true);
    else if (id === "play-2p") play(false);
    else if (id === "book" || id === "book-go" || id === "request") window.open(REQUEST_URL, "_blank", "noopener,noreferrer");
    else if (id === "tour") window.open(TOUR_URL, "_blank", "noopener,noreferrer");
    else if (id === "map") window.open(MAPS_URL, "_blank", "noopener,noreferrer");
    else if (id === "rip") setRipGo(true);
    else if (id === "close") setBookStep(null);
    else if (id === "save") document.querySelector<HTMLFormElement>("#score-form")?.requestSubmit();
    else if (id === "resume") gameRef.current?.togglePause();
    else if (id === "rematch") play(result?.vsAI ?? true);
    else if (id === "rematch-pause") play(gameRef.current?.versusAi ?? true);
    else if (id === "menu" || id === "change" || id === "done") gameRef.current?.toMenu();
    else if (id === "mute") gameRef.current?.toggleMute();
    else if (id === "shake") gameRef.current?.toggleShake();
    else if (id === "tips") gameRef.current?.setTips(!tips);
  }

  useCabinet(navRows.length > 0, (action) => {
    if (action === "back") {
      if (bookStep) setBookStep(null);
      else if (paused) gameRef.current?.togglePause();
      return;
    }
    if (action !== "press") {
      setStick((current) => {
        if (!navRows.length) return current;
        let row = Math.min(current.row, navRows.length - 1);
        let col = current.col;
        if (action === "up") row = (row - 1 + navRows.length) % navRows.length;
        if (action === "down") row = (row + 1) % navRows.length;
        const width = navRows[row].length;
        if (action === "left") col = (Math.min(col, width - 1) - 1 + width) % width;
        else if (action === "right") col = (Math.min(col, width - 1) + 1) % width;
        else col = Math.min(col, width - 1);
        return { row, col };
      });
      return;
    }
    activate(activeId);
  });

  return (
    <div className="flex h-dvh w-full justify-center bg-bg">
    <div
      className="relative h-dvh w-full max-w-lg touch-none overflow-hidden bg-bg text-fg select-none"
      onPointerDown={() => gameRef.current?.unlock()}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" aria-label="Hyper Strike court" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] text-magenta">
        <div className="flex h-11 items-center gap-3">
          <span className="w-12 font-display text-xs tracking-widest">{labels.top}</span>
          <Pips rowRef={topRef} />
        </div>
      </div>

      <div
        ref={calloutRef}
        className="callout pointer-events-none absolute inset-x-0 top-[32%] z-10 text-center font-display text-3xl font-extrabold tracking-wide opacity-0 sm:text-5xl"
        aria-live="polite"
      />
      <div
        ref={subRef}
        className="pointer-events-none absolute inset-x-0 top-[40%] z-10 text-center text-sm font-bold tracking-wide text-fg opacity-0"
      />
      <div
        ref={comboRef}
        className="pointer-events-none absolute inset-x-0 top-[46%] z-10 text-center font-display text-sm font-bold tracking-widest text-amber opacity-0"
      />
      {phase === "live" && coach && (
        <p className="pointer-events-none absolute inset-x-0 top-14 z-10 text-center text-sm font-semibold text-fg">
          EDGE spikes · MIDDLE saves
        </p>
      )}
      {phase === "live" && tip && (
        <p className="pointer-events-none absolute inset-x-0 top-14 z-10 text-center text-sm font-semibold text-amber">
          {tip}
        </p>
      )}
      {phase === "live" && note && (
        <p className="pointer-events-none absolute inset-x-4 top-24 z-10 mx-auto max-w-xs rounded-full border border-border bg-surface/90 px-3 py-2 text-center text-sm text-fg">
          {note}
        </p>
      )}
      {phase === "live" && card && (
        <div className="pointer-events-none absolute inset-x-4 top-20 z-10 mx-auto max-w-xs rounded-2xl border border-border bg-surface/95 px-4 py-3 text-center shadow-xl">
          <p className="font-display text-xs font-extrabold tracking-widest text-amber">RALLY 1</p>
          <p className="mt-1 font-display text-lg font-extrabold text-fg">EDGE · SPIKE</p>
          <p className="font-display text-lg font-extrabold text-cyan">MIDDLE · SAVE</p>
        </div>
      )}
      {phase === "live" && (
        <div className="pointer-events-none absolute inset-x-6 bottom-16 z-10">
          <div className="mb-1 flex justify-between text-[11px] font-bold tracking-widest text-amber">
            <span>RALLY {live.combo}</span>
            <span>
              {live.mul.toFixed(1)}x · {live.score}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-amber transition-[width]" style={{ width: `${Math.min(100, live.combo * 10)}%` }} />
          </div>
        </div>
      )}
      {phase === "live" && ghost && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex items-center justify-center gap-10 text-cyan">
          <ChevronLeft className="size-10 ghost-arrow" />
          <span className="text-sm font-bold tracking-widest">DRAG</span>
          <ChevronRight className="size-10 ghost-arrow" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-cyan">
        <span className="pointer-events-none w-10 font-display text-xs tracking-widest">{labels.bottom}</span>
        <div className="pointer-events-none min-w-0 flex-1">
          <Pips rowRef={botRef} />
        </div>
        <button
          type="button"
          aria-pressed={muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          onClick={() => gameRef.current?.toggleMute()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-fg"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <button
          type="button"
          aria-pressed={shake}
          aria-label={shake ? "Turn screen shake off" : "Turn screen shake on"}
          onClick={() => gameRef.current?.toggleShake()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-fg"
        >
          <Vibrate className="size-4" />
        </button>
        {phase === "live" && (
          <button
            type="button"
            aria-label="Pause"
            onClick={() => gameRef.current?.togglePause()}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-fg"
          >
            <Pause className="size-4" />
          </button>
        )}
      </div>

      {phase === "menu" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 pt-14 pb-16">
          <div className="pointer-events-auto max-h-[calc(100dvh-6rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface/95 p-5 shadow-2xl">
            <h1 className="text-center font-display text-4xl font-extrabold tracking-wide text-cyan">HYPER STRIKE</h1>
            <p className="mt-1 text-center text-sm text-muted">Five hearts. Then the paddle pops.</p>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {(Object.keys(MODE_LABEL) as Mode[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  data-stick={`mode:${id}`}
                  aria-pressed={mode === id}
                  onClick={() => {
                    setMode(id);
                    gameRef.current?.setMode(id);
                  }}
                  className={`h-9 rounded-xl border text-[11px] font-extrabold tracking-wide ${mode === id ? "border-amber bg-amber/15 text-fg" : "border-border text-muted"} ${ring(`mode:${id}`)}`}
                >
                  {MODE_LABEL[id]}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                data-stick="easy"
                aria-pressed={easy}
                onClick={() => gameRef.current?.setEasy(true)}
                className={`h-11 rounded-2xl border-2 text-sm font-extrabold tracking-wide ${easy ? "border-cyan bg-cyan/15 text-fg" : "border-border text-muted"} ${ring("easy")}`}
              >
                Easy
              </button>
              <button
                type="button"
                data-stick="spicy"
                aria-pressed={!easy}
                onClick={() => gameRef.current?.setEasy(false)}
                className={`h-11 rounded-2xl border-2 text-sm font-extrabold tracking-wide ${easy ? "border-border text-muted" : "border-magenta bg-magenta/15 text-fg"} ${ring("spicy")}`}
              >
                Spicy
              </button>
            </div>
            <button
              type="button"
              data-stick="play-bot"
              onClick={() => play(true)}
              className={`mt-3 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-lg font-extrabold tracking-wide text-fg ${ring("play-bot")}`}
            >
              Play vs Bot
            </button>
            <button
              type="button"
              data-stick="play-2p"
              onClick={() => play(false)}
              className={`mt-2 h-12 w-full rounded-2xl border-2 border-magenta bg-magenta/15 text-lg font-extrabold tracking-wide text-fg ${ring("play-2p")}`}
            >
              2 Players
            </button>
            <p className="mt-3 text-center text-sm font-semibold text-fg">You: drag the bottom, or A and D. Taunts: 1 2 3 4.</p>
            <p className="text-center text-sm font-semibold text-fg">P2: drag the top, or J and L. Taunts: 7 8 9 0.</p>
            <p className="text-center text-xs font-semibold text-muted">Menus: joystick or arrows. Button, Enter, or Z confirms. X goes back.</p>
            {meta && (
              <p className="mt-2 text-center text-xs font-semibold text-amber">
                Today: {meta.challenge.label}
                {meta.challenge.done ? " · done" : ` · ${meta.challenge.progress}/${meta.challenge.goal}`}
              </p>
            )}
            <p className="mt-2 text-center text-xs text-muted">
              {easy ? "Easy is slower. The bot misses. Spicy stays honest." : "Spicy is full speed. Easy is the practice dojo."}
            </p>
            <ChipRow earned={chips} />
            <p className="mt-2 text-center text-sm font-semibold text-amber">
              {best > 0 ? `Best streak ${best}` : "First win starts your streak."}
            </p>
            {prizeLine(wins) && <p className="mt-1 text-center text-sm font-semibold text-cyan">{prizeLine(wins)}</p>}
            {meta && meta.board.length > 0 && (
              <ol className="mt-2 space-y-0.5 text-center text-xs text-muted">
                {meta.board.map((row, i) => (
                  <li key={`${row.name}-${i}`}>
                    {i + 1}. {row.name} · {row.score} · {MODE_LABEL[row.mode]}
                  </li>
                ))}
              </ol>
            )}
            {meta && (
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {owned(1 + Math.floor(meta.xp / 250)).trails.map((id) => (
                  <button
                    key={`t-${id}`}
                    type="button"
                    data-stick={`trail:${id}`}
                    onClick={() => {
                      gameRef.current?.setLook("trail", id);
                      setMeta({ ...meta, trail: id });
                    }}
                    className={`h-8 rounded-full border px-2 text-[10px] font-bold ${meta.trail === id ? "border-cyan text-cyan" : "border-border text-muted"} ${ring(`trail:${id}`)}`}
                  >
                    {id}
                  </button>
                ))}
                {owned(1 + Math.floor(meta.xp / 250)).skins.map((id) => (
                  <button
                    key={`s-${id}`}
                    type="button"
                    data-stick={`skin:${id}`}
                    onClick={() => {
                      gameRef.current?.setLook("skin", id);
                      setMeta({ ...meta, skin: id });
                    }}
                    className={`h-8 rounded-full border px-2 text-[10px] font-bold ${meta.skin === id ? "border-magenta text-magenta" : "border-border text-muted"} ${ring(`skin:${id}`)}`}
                  >
                    {id}
                  </button>
                ))}
                {owned(1 + Math.floor(meta.xp / 250)).themes.map((id) => (
                  <button
                    key={`h-${id}`}
                    type="button"
                    data-stick={`theme:${id}`}
                    onClick={() => {
                      gameRef.current?.setLook("theme", id);
                      setMeta({ ...meta, theme: id });
                    }}
                    className={`h-8 rounded-full border px-2 text-[10px] font-bold ${meta.theme === id ? "border-amber text-amber" : "border-border text-muted"} ${ring(`theme:${id}`)}`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-center text-[10px] tracking-wide text-muted">Created with Grok — Remix</p>
            <ParentLinks hot={activeId} quiet />
          </div>
        </div>
      )}

      {phase === "end" && result && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 pt-14 pb-16">
          <div className="pointer-events-auto max-h-full w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface/95 p-5 text-center shadow-2xl">
            <h2 className={`font-display text-3xl font-extrabold tracking-wide ${result.youWin ? "text-cyan" : "text-magenta"}`}>
              {result.youWin ? "YOU WIN" : result.vsAI ? "SO CLOSE" : "P2 WINS"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-fg">{result.ko}</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-wide text-amber">{result.score}</p>
            <div className="mt-2">
              <div className="flex justify-between text-[11px] font-bold text-cyan">
                <span>LV {result.level}</span>
                <span>+{result.xpGain} XP</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-cyan" style={{ width: `${Math.min(100, (result.xpHave / result.xpNeed) * 100)}%` }} />
              </div>
              {result.unlocked.length > 0 && (
                <p className="mt-1 text-xs font-semibold text-amber">Unlocked {result.unlocked.join(", ")}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-muted">
              Rally {result.stats.rally} · {result.stats.speed} speed · {result.stats.hits} hits · {result.stats.efficiency}% power-ups
            </p>
            <p className="mt-2 font-display text-3xl tracking-widest" aria-label={`${result.stars} of 3 stars`}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={i < result.stars ? "text-amber" : "text-muted"}>
                  {i < result.stars ? "★" : "☆"}
                </span>
              ))}
            </p>
            <p className="mt-2 text-sm text-muted">
              {result.winnerHp} HP left · best rally {result.rally} · {result.seconds}s
            </p>
            {!result.vsAI && <p className="mt-2 text-sm text-fg">Local duel · rematch or swap seats</p>}
            {!result.vsAI && <p className="mt-1 text-sm font-semibold text-amber">Best rally {result.rally}</p>}
            {result.vsAI && result.streak > 0 && (
              <p className="mt-2 text-sm font-semibold text-amber">Streak {result.streak}</p>
            )}
            {result.nextTry && <p className="mt-2 text-sm font-semibold text-cyan">{result.nextTry}</p>}
            {result.prize && <p className="mt-1 text-sm font-semibold text-cyan">{result.prize}</p>}
            <ChipRow earned={result.chips} />
            {result.needsInitials && !boardSaved && (
              <form
                id="score-form"
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = (initials || "YOU").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3).padEnd(3, "A");
                  const next = loadMeta();
                  next.board = pushScore(next.board, { name, score: result.score, mode: result.mode });
                  next.challenge = result.challenge;
                  saveMeta(next);
                  setMeta(next);
                  setBoardSaved(true);
                }}
              >
                <input
                  value={initials}
                  data-stick="initials"
                  maxLength={3}
                  aria-label="Three initials"
                  onChange={(e) => setInitials(e.target.value.toUpperCase())}
                  className={`h-12 w-24 rounded-2xl border border-border bg-bg text-center font-display text-xl tracking-widest ${ring("initials")}`}
                  placeholder="AAA"
                />
                <button type="submit" data-stick="save" className={`h-12 flex-1 rounded-2xl border-2 border-amber text-sm font-extrabold text-amber ${ring("save")}`}>
                  Save score
                </button>
              </form>
            )}
            <button
              type="button"
              data-stick="rematch"
              onClick={() => play(result.vsAI)}
              className={`mt-4 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-base font-extrabold tracking-wide text-fg ${ring("rematch")}`}
            >
              Rematch
            </button>
            {rounds >= 2 && <ParentLinks hot={activeId} quiet />}
            <button
              type="button"
              data-stick="change"
              onClick={() => gameRef.current?.toMenu()}
              className={`mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold tracking-wide text-fg ${ring("change")}`}
            >
              Change mode
            </button>
            <button
              type="button"
              data-stick="done"
              onClick={() => gameRef.current?.toMenu()}
              className={`mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold tracking-wide text-fg ${ring("done")}`}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {paused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg/80 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-5 text-center shadow-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-wide text-fg">PAUSED</h2>
            <button
              type="button"
              data-stick="resume"
              onClick={() => gameRef.current?.togglePause()}
              className={`mt-4 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-base font-extrabold text-fg ${ring("resume")}`}
            >
              Resume
            </button>
            <button
              type="button"
              data-stick="rematch-pause"
              onClick={() => play(gameRef.current?.versusAi ?? true)}
              className={`mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold text-fg ${ring("rematch-pause")}`}
            >
              Rematch
            </button>
            <button
              type="button"
              data-stick="menu"
              onClick={() => gameRef.current?.toMenu()}
              className={`mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold text-fg ${ring("menu")}`}
            >
              Menu
            </button>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                data-stick="mute"
                aria-pressed={muted}
                aria-label={muted ? "Turn sound on" : "Turn sound off"}
                onClick={() => gameRef.current?.toggleMute()}
                className={`inline-flex size-11 items-center justify-center rounded-full border border-border ${ring("mute")}`}
              >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <button
                type="button"
                data-stick="shake"
                aria-pressed={shake}
                aria-label={shake ? "Turn screen shake off" : "Turn screen shake on"}
                onClick={() => gameRef.current?.toggleShake()}
                className={`inline-flex size-11 items-center justify-center rounded-full border border-border ${ring("shake")}`}
              >
                <Vibrate className="size-4" />
              </button>
              <button
                type="button"
                data-stick="tips"
                aria-pressed={tips}
                onClick={() => gameRef.current?.setTips(!tips)}
                className={`h-11 rounded-full border px-3 text-xs font-extrabold tracking-wide ${tips ? "border-amber text-amber" : "border-border text-muted"} ${ring("tips")}`}
              >
                Tips
              </button>
            </div>
            <ParentLinks hot={activeId} />
          </div>
        </div>
      )}
      {bookStep === "request" && <RequestCard hot={activeId} onClose={() => setBookStep(null)} />}
      {bookStep === "prize" && (
        <PackReveal
          hot={activeId}
          go={ripGo}
          onStart={() => setRipGo(true)}
          onDone={() => setPackOpen(true)}
          onClose={() => setBookStep(null)}
        />
      )}
    </div>
    </div>
  );
}
