import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pause, n as Volume2, o as ChevronRight, r as Vibrate, s as ChevronLeft, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cZjgdX9N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "hyper-strike-meta";
var STEP = 250;
var CHALLENGES = [
	{
		id: "rally",
		label: "Land a 15-hit rally",
		goal: 15
	},
	{
		id: "pickups",
		label: "Collect 5 power-ups in one game",
		goal: 5
	},
	{
		id: "score",
		label: "Score 2,500 in one game",
		goal: 2500
	},
	{
		id: "spikes",
		label: "Land 4 spikes in one game",
		goal: 4
	}
];
var MODE_LABEL = {
	duel: "Duel",
	survival: "Survival",
	speed: "Sprint",
	chaos: "Chaos"
};
function levelOf(xp) {
	return 1 + Math.floor(Math.max(0, xp) / STEP);
}
function xpSlice(xp) {
	const into = Math.max(0, xp) % STEP;
	return {
		level: levelOf(xp),
		have: into,
		need: STEP
	};
}
function owned(level) {
	return {
		trails: [
			"spark",
			"comet",
			"ribbon"
		].filter((_, i) => level >= [
			1,
			2,
			5
		][i]),
		skins: [
			"classic",
			"candy",
			"void"
		].filter((_, i) => level >= [
			1,
			3,
			6
		][i]),
		themes: [
			"arcade",
			"soft",
			"crunch"
		].filter((_, i) => level >= [
			1,
			4,
			7
		][i])
	};
}
function unlockNames(prevLevel, nextLevel) {
	const before = owned(prevLevel);
	const after = owned(nextLevel);
	const names = [];
	for (const id of after.trails) if (!before.trails.includes(id) && id !== "spark") names.push(`${id} trail`);
	for (const id of after.skins) if (!before.skins.includes(id) && id !== "classic") names.push(`${id} paddle`);
	for (const id of after.themes) if (!before.themes.includes(id) && id !== "arcade") names.push(`${id} sounds`);
	return names;
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function freshChallenge(day = today()) {
	return {
		...CHALLENGES[Math.abs(hash(day)) % CHALLENGES.length],
		progress: 0,
		done: false,
		day
	};
}
function hash(s) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = h * 33 + s.charCodeAt(i) | 0;
	return h;
}
function defaultMeta() {
	return {
		xp: 0,
		trail: "spark",
		skin: "classic",
		theme: "arcade",
		board: [],
		challenge: freshChallenge()
	};
}
function loadMeta() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaultMeta();
		const parsed = JSON.parse(raw);
		const base = defaultMeta();
		const day = today();
		const challenge = parsed.challenge?.day === day ? parsed.challenge : freshChallenge(day);
		return {
			xp: Number(parsed.xp) || 0,
			trail: parsed.trail || "spark",
			skin: parsed.skin || "classic",
			theme: parsed.theme || "arcade",
			board: Array.isArray(parsed.board) ? parsed.board.slice(0, 5) : [],
			challenge: challenge || base.challenge
		};
	} catch {
		return defaultMeta();
	}
}
function saveMeta(meta) {
	try {
		localStorage.setItem(KEY, JSON.stringify(meta));
	} catch {}
}
function grantXp(meta, score, won) {
	const prev = levelOf(meta.xp);
	const gain = Math.round(score / 8) + (won ? 50 : 15);
	meta.xp += gain;
	const level = levelOf(meta.xp);
	return {
		gain,
		level,
		unlocked: unlockNames(prev, level),
		slice: xpSlice(meta.xp)
	};
}
function noteChallenge(meta, kind, value) {
	if (meta.challenge.day !== today()) meta.challenge = freshChallenge();
	if (meta.challenge.id !== kind || meta.challenge.done) return meta.challenge;
	meta.challenge.progress = Math.max(meta.challenge.progress, value);
	meta.challenge.done = meta.challenge.progress >= meta.challenge.goal;
	return meta.challenge;
}
function qualifies(board, score) {
	if (score < 100) return false;
	if (board.length < 5) return true;
	return score > board[board.length - 1].score;
}
function pushScore(board, row) {
	return [...board, row].sort((a, b) => b.score - a.score).slice(0, 5);
}
/**
* Hyper Strike — paddles have 5 HP and shatter.
* Edge contact arms a spike. A hot ball cracks the receiver unless they
* defuse it on the paddle's center. Shields parry one crack. At 12s the
* ball goes HYPER and every touch cracks, so the round always ends.
*/
var CHIP_LABEL = {
	spike: "First spike",
	rally: "5-hit rally",
	shield: "Shield save",
	easy: "Easy clear"
};
var CYAN = "#3ef0ff";
var MAGENTA = "#ff3d7a";
var AMBER = "#ffc44d";
var BG = "#07070e";
var FG = "#f4f6fb";
var HYPER_AT = 12;
var MAX_HP = 5;
var ORB_LABEL = {
	shield: "SAFE",
	repair: "HEAL",
	wide: "CAKE",
	fire: "HOT",
	slow: "SLOW",
	shrink: "TINY",
	burst: "ZOOM",
	mystery: "?",
	multi: "MULTI",
	freeze: "ICE",
	curve: "CURVE"
};
var ORB_WEIGHTS = [
	{
		kind: "mystery",
		w: 34
	},
	{
		kind: "shield",
		w: 16
	},
	{
		kind: "repair",
		w: 10
	},
	{
		kind: "wide",
		w: 8
	},
	{
		kind: "fire",
		w: 8
	},
	{
		kind: "burst",
		w: 6
	},
	{
		kind: "slow",
		w: 4
	},
	{
		kind: "shrink",
		w: 4
	},
	{
		kind: "multi",
		w: 5
	},
	{
		kind: "freeze",
		w: 5
	},
	{
		kind: "curve",
		w: 6
	}
];
function deadParticle() {
	return {
		on: false,
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		life: 0,
		max: 1,
		color: FG,
		size: 2,
		grav: 0,
		rot: 0,
		vr: 0,
		shard: false,
		star: false
	};
}
function prizeLine(wins) {
	if (wins < 1) return "1 more win for the dino paddle";
	if (wins < 3) {
		const left = 3 - wins;
		return `${left} more win${left === 1 ? "" : "s"} for the pizza paddle`;
	}
	if (wins < 5) {
		const left = 5 - wins;
		return `${left} more win${left === 1 ? "" : "s"} for the robot paddle`;
	}
	return "Robot paddle unlocked";
}
function foldX(x, w) {
	const span = w * 2;
	const m = (x % span + span) % span;
	return m > w ? span - m : m;
}
function roundRect(ctx, x, y, w, h, r) {
	const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
	ctx.beginPath();
	ctx.moveTo(x + rad, y);
	ctx.arcTo(x + w, y, x + w, y + h, rad);
	ctx.arcTo(x + w, y + h, x, y + h, rad);
	ctx.arcTo(x, y + h, x, y, rad);
	ctx.arcTo(x, y, x + w, y, rad);
	ctx.closePath();
}
function heartPath(ctx, r) {
	const s = r * 1.15;
	ctx.beginPath();
	ctx.moveTo(0, -s * .2);
	ctx.bezierCurveTo(-s * .1, -s * .65, -s * .85, -s * .45, -s * .55, -s * .05);
	ctx.bezierCurveTo(-s * .45, s * .25, -s * .15, s * .4, 0, s * .72);
	ctx.bezierCurveTo(s * .15, s * .4, s * .45, s * .25, s * .55, -s * .05);
	ctx.bezierCurveTo(s * .85, -s * .45, s * .1, -s * .65, 0, -s * .2);
	ctx.closePath();
}
function shieldPath(ctx, r) {
	ctx.beginPath();
	ctx.moveTo(-r * .9, -r * .78);
	ctx.lineTo(r * .9, -r * .78);
	ctx.lineTo(r * .98, -r * .12);
	ctx.quadraticCurveTo(r * .62, r * .62, 0, r * 1.05);
	ctx.quadraticCurveTo(-r * .62, r * .62, -r * .98, -r * .12);
	ctx.closePath();
}
function starPath(ctx, r) {
	ctx.beginPath();
	for (let i = 0; i < 10; i++) {
		const a = -Math.PI / 2 + i * Math.PI / 5;
		const rad = i % 2 === 0 ? r : r * .42;
		const x = Math.cos(a) * rad;
		const y = Math.sin(a) * rad;
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	}
	ctx.closePath();
}
var Sfx = class {
	ctx = null;
	master = null;
	muted = false;
	wave = "square";
	score = new Score();
	unlock() {
		const w = window;
		const AC = window.AudioContext ?? w.webkitAudioContext;
		if (!AC) return;
		if (!this.ctx) {
			this.ctx = new AC({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.master.gain.value = .42;
			this.master.connect(this.ctx.destination);
			this.score.attach(this.ctx, this.master);
			if (this.muted) this.master.gain.value = 0;
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
		this.score.nudge();
	}
	setMuted(muted) {
		this.muted = muted;
		this.score.muted = muted;
		if (!this.ctx || !this.master) return;
		this.master.gain.setTargetAtTime(muted ? 0 : .42, this.ctx.currentTime, .02);
		if (!muted) this.score.nudge();
	}
	beep(freq, dur, type, gain, slide = 0) {
		if (!this.ctx || !this.master || this.muted) return;
		try {
			const t = this.ctx.currentTime;
			const jitter = .94 + Math.random() * .12;
			const f = Math.max(48, freq * jitter);
			const o = this.ctx.createOscillator();
			const g = this.ctx.createGain();
			o.type = type;
			o.frequency.setValueAtTime(f, t);
			if (slide !== 0) o.frequency.exponentialRampToValueAtTime(Math.max(48, f + slide), t + dur);
			g.gain.setValueAtTime(Math.max(.001, gain), t);
			g.gain.exponentialRampToValueAtTime(.001, t + dur);
			o.connect(g);
			g.connect(this.master);
			o.start(t);
			o.stop(t + dur + .02);
			o.onended = () => {
				o.disconnect();
				g.disconnect();
			};
		} catch {}
	}
	noise(dur, gain) {
		if (!this.ctx || !this.master || this.muted) return;
		try {
			const n = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
			const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
			const data = buf.getChannelData(0);
			for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
			const src = this.ctx.createBufferSource();
			src.buffer = buf;
			const filter = this.ctx.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = 700;
			const g = this.ctx.createGain();
			g.gain.value = gain;
			src.connect(filter);
			filter.connect(g);
			g.connect(this.master);
			src.start();
			src.onended = () => {
				src.disconnect();
				filter.disconnect();
				g.disconnect();
			};
		} catch {}
	}
	hit(freq = 540) {
		this.beep(freq, .05, this.wave, .07);
		this.noise(.035, .1);
	}
	setTheme(theme) {
		this.wave = theme === "soft" ? "sine" : theme === "crunch" ? "sawtooth" : "square";
	}
	spike() {
		this.score.duck();
		this.beep(230, .09, "sawtooth", .09, 200);
		this.noise(.05, .14);
	}
	crack() {
		this.score.duck();
		this.beep(150, .12, "square", .13, -70);
		this.noise(.08, .2);
	}
	parry() {
		this.score.duck();
		this.beep(680, .07, "square", .1, 240);
		this.beep(980, .1, "triangle", .07, 80);
	}
	defuse() {
		this.beep(860, .08, "sine", .07, -240);
	}
	pickup() {
		this.beep(480, .06, "triangle", .08, 220);
		this.beep(740, .09, "sine", .06, 180);
	}
	rally() {
		this.beep(420, .07, "square", .07, 180);
		this.beep(680, .1, "triangle", .06, 160);
	}
	shatter() {
		this.score.duck();
		this.beep(620, .07, "triangle", .1, 220);
		this.beep(880, .1, "square", .055, 160);
	}
	honk() {
		this.beep(520, .06, "square", .08, 140);
		this.beep(780, .1, "triangle", .06, 40);
	}
	heart() {
		this.beep(92, .07, "sine", .05);
	}
	serve() {
		this.beep(380, .05, "square", .05);
	}
};
/** Procedural soundtrack. Menu bounces in major. The match is faster. Hyper opens the filter. */
var Score = class {
	muted = false;
	heat = 0;
	ctx = null;
	bus = null;
	filter = null;
	scene = "menu";
	step = 0;
	next = 0;
	started = false;
	level = .72;
	kicks = [];
	attach(ctx, master) {
		if (this.ctx) return;
		this.ctx = ctx;
		this.filter = ctx.createBiquadFilter();
		this.filter.type = "lowpass";
		this.filter.frequency.value = 1500;
		this.filter.Q.value = .6;
		const comp = ctx.createDynamicsCompressor();
		comp.threshold.value = -16;
		comp.knee.value = 8;
		comp.ratio.value = 2.4;
		comp.attack.value = .004;
		comp.release.value = .14;
		this.bus = ctx.createGain();
		this.bus.gain.value = this.level;
		this.filter.connect(comp);
		comp.connect(this.bus);
		this.bus.connect(master);
		this.paintFilter(this.scene);
	}
	nudge() {
		if (!this.ctx || !this.started) return;
		if (this.next < this.ctx.currentTime - .03) this.next = this.ctx.currentTime + .04;
	}
	setScene(scene) {
		if (scene === this.scene) return;
		const prev = this.scene;
		this.scene = scene;
		this.paintFilter(scene);
		if (!this.ctx) return;
		if (scene === "break") {
			this.playBreak();
			return;
		}
		if (scene === "menu" || scene === "match" && prev !== "hyper") {
			this.step = 0;
			this.next = this.ctx.currentTime + .03;
			this.started = true;
		}
		if (scene === "hyper") this.riser();
	}
	advance() {
		const ctx = this.ctx;
		if (!ctx || !this.filter) return;
		const now = ctx.currentTime;
		this.kicks = this.kicks.filter((t) => t > now - .25);
		const scene = this.scene;
		if (scene === "break") return;
		if (!this.started) {
			this.started = true;
			this.step = 0;
			this.next = now + .06;
		}
		if (this.next < now - .05) this.next = now + .02;
		const eighth = 60 / (scene === "hyper" ? 158 : scene === "match" ? 138 : 116) / 2;
		const horizon = now + .2;
		let guard = 0;
		while (this.next < horizon && guard++ < 8) {
			this.fire(this.next, this.step, scene);
			this.step = (this.step + 1) % 16;
			this.next += eighth;
		}
	}
	pulse() {
		const ctx = this.ctx;
		if (!ctx) return 0;
		const now = ctx.currentTime;
		let p = 0;
		for (const t of this.kicks) {
			const age = now - t;
			if (age >= 0 && age < .16) p = Math.max(p, 1 - age / .16);
		}
		return p;
	}
	duck() {
		if (!this.bus || !this.ctx || this.muted) return;
		const t = this.ctx.currentTime;
		const g = this.bus.gain;
		g.cancelScheduledValues(t);
		g.setValueAtTime(Math.max(.05, g.value), t);
		g.linearRampToValueAtTime(.16, t + .025);
		g.linearRampToValueAtTime(this.level, t + .2);
	}
	flourish(win) {
		if (!this.ctx || this.muted) return;
		const t = this.ctx.currentTime + .02;
		if (win) {
			this.tone(t, 523.25, .1, "triangle", .05);
			this.tone(t + .09, 659.25, .1, "triangle", .05);
			this.tone(t + .18, 783.99, .12, "triangle", .055);
			this.tone(t + .28, 1046.5, .2, "sine", .05);
		} else {
			this.tone(t, 440, .08, "square", .04);
			this.tone(t + .1, 349.23, .16, "triangle", .04);
		}
	}
	paintFilter(scene) {
		if (!this.filter || !this.ctx) return;
		const freq = scene === "hyper" ? 8800 : scene === "match" ? 4600 : 2400;
		this.filter.frequency.setTargetAtTime(freq, this.ctx.currentTime, .06);
	}
	fire(when, step, scene) {
		const hyper = scene === "hyper";
		const match = scene !== "menu";
		if (step % 4 === 0) this.kick(when, match ? hyper ? .16 : .13 : .07);
		if (match && (step === 4 || step === 12)) this.clap(when);
		if (match && step % 2 === 1) this.hat(when, hyper ? .04 : .024);
		if (hyper && step % 2 === 0 && step % 4 !== 0) this.hat(when, .03);
		if (match) {
			const bass = [
				130.81,
				98,
				164.81,
				130.81,
				196,
				164.81,
				146.83,
				220
			];
			const idx = hyper ? step % 8 : Math.floor(step / 2) % 8;
			if (hyper || step % 2 === 0) this.tone(when, bass[idx], hyper ? .09 : .12, "square", hyper ? .036 : .04);
			const lead = [
				523.25,
				659.25,
				783.99,
				880,
				659.25,
				987.77,
				783.99,
				1046.5
			];
			if (hyper) this.tone(when, lead[step % 8], .08, "square", .026);
			else if (step % 2 === 0) this.tone(when, lead[step / 2 % 8], .1, "square", .028);
			if (this.heat >= 3 && step % 4 === 0) this.tone(when, 1174.66, .08, "triangle", .02);
			if (this.heat >= 6 && step % 2 === 0) this.tone(when, 1567.98, .06, "sine", .015);
			if (this.heat >= 10 && step % 2 === 0) this.tone(when, 2093, .05, "square", .011);
		} else {
			if (step % 4 === 0) this.tone(when, [
				130.81,
				164.81,
				196,
				146.83
			][step / 4], .16, "triangle", .05);
			if (step % 4 === 2) this.tone(when, 261.63, .08, "square", .02);
			const arp = [
				523.25,
				659.25,
				783.99,
				659.25,
				880,
				783.99,
				659.25,
				523.25
			];
			if (step % 2 === 0) this.tone(when, arp[step / 2], .11, "triangle", .03);
			if (step % 2 === 1) this.hat(when, .014);
		}
	}
	kick(when, gain) {
		this.kicks.push(when);
		this.tone(when, 148, .1, "sine", gain, -96);
		this.tone(when, 62, .14, "sine", gain * .85, -28);
	}
	clap(when) {
		this.burst(when, .07, .05, "bandpass", 1400);
	}
	hat(when, gain) {
		this.burst(when, .03, gain, "highpass", 4200);
	}
	riser() {
		if (!this.ctx || this.muted) return;
		this.tone(this.ctx.currentTime, 180, .42, "sawtooth", .03, 900);
	}
	playBreak() {
		if (!this.ctx) return;
		this.started = true;
		if (this.muted) return;
		const t = this.ctx.currentTime;
		this.burst(t, .2, .07, "highpass", 900);
		this.tone(t, 220, .16, "sawtooth", .05, -40);
		this.tone(t + .14, 174.61, .16, "triangle", .045);
		this.tone(t + .3, 130.81, .22, "sine", .05);
		this.tone(t + .48, 110, .28, "sine", .04);
	}
	tone(when, freq, dur, type, gain, slide = 0) {
		if (!this.ctx || !this.filter || this.muted) return;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = type;
		o.frequency.setValueAtTime(Math.max(40, freq), when);
		if (slide !== 0) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), when + dur);
		g.gain.setValueAtTime(Math.max(8e-4, gain), when);
		g.gain.exponentialRampToValueAtTime(8e-4, when + dur);
		o.connect(g);
		g.connect(this.filter);
		o.start(when);
		o.stop(when + dur + .02);
		o.onended = () => {
			o.disconnect();
			g.disconnect();
		};
	}
	burst(when, dur, gain, kind, freq) {
		if (!this.ctx || !this.filter || this.muted) return;
		const n = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
		const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
		const src = this.ctx.createBufferSource();
		src.buffer = buf;
		const filter = this.ctx.createBiquadFilter();
		filter.type = kind;
		filter.frequency.value = freq;
		const g = this.ctx.createGain();
		g.gain.setValueAtTime(gain, when);
		g.gain.exponentialRampToValueAtTime(8e-4, when + dur);
		src.connect(filter);
		filter.connect(g);
		g.connect(this.filter);
		src.start(when);
		src.stop(when + dur + .02);
		src.onended = () => {
			src.disconnect();
			filter.disconnect();
			g.disconnect();
		};
	}
};
var HyperStrikeGame = class {
	sfx = new Sfx();
	versusAi = true;
	easy = true;
	paused = false;
	mode = "duel";
	trailId = "spark";
	skinId = "classic";
	theme = "arcade";
	canvas;
	ctx;
	hooks;
	ro;
	parts;
	keys = /* @__PURE__ */ new Set();
	p1;
	p2;
	ball = {
		x: 0,
		y: 0,
		r: 8,
		dx: 0,
		dy: 0,
		armed: false,
		fireUntil: 0,
		curve: 0,
		life: 0
	};
	clones = [];
	orbs = [];
	floats = [];
	trail = [];
	pts = /* @__PURE__ */ new Map();
	W = 400;
	H = 700;
	dpr = 1;
	scale = 1;
	phase = "demo";
	time = 0;
	acc = 0;
	roundTime = 0;
	serveT = 0;
	serveDir = 1;
	hyper = false;
	combo = 0;
	score = 0;
	hits = 0;
	maxSpeed = 0;
	pickups = 0;
	useful = 0;
	spikes = 0;
	bestCombo = 0;
	lock = 0;
	hitstop = 0;
	trauma = 0;
	flash = 0;
	flashColor = FG;
	lastHit = "p2";
	aiAim = 0;
	demoAim = 0;
	prevDy = 0;
	aim1 = null;
	aim2 = null;
	orbTimer = 1.1;
	spawns = 0;
	pityUsed = false;
	firstCrack = false;
	coach = false;
	lesson = false;
	contacts = 0;
	plays = 0;
	tips = true;
	nudged = false;
	tipUntil = 0;
	cardOn = false;
	ghostOn = false;
	chips = /* @__PURE__ */ new Set();
	seen = /* @__PURE__ */ new Set();
	shatterT = 0;
	loser = "p2";
	ended = false;
	streak = 0;
	wins = 0;
	best = 0;
	lastBeat = 0;
	shoutUntil = 0;
	shoutPri = 0;
	hudKey = "";
	shakeOn = true;
	reduced = false;
	lastStart = -10;
	constructor(canvas, hooks) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas unsupported");
		this.ctx = ctx;
		this.hooks = hooks;
		this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		this.shakeOn = !this.reduced;
		this.loadPrefs();
		this.p1 = this.makePaddle("p1", CYAN);
		this.p2 = this.makePaddle("p2", MAGENTA);
		this.parts = Array.from({ length: 340 }, () => deadParticle());
		this.resize();
		this.ro = new ResizeObserver(() => this.resize());
		this.ro.observe(canvas);
		this.bind();
		this.phase = "demo";
		this.placeBall(Math.random() < .5 ? 1 : -1, true);
		this.hooks.prefs(this.prefSnapshot());
		this.emitHud(true);
	}
	destroy() {
		this.ro.disconnect();
		this.canvas.removeEventListener("pointerdown", this.onPointerDown);
		this.canvas.removeEventListener("pointermove", this.onPointerMove);
		this.canvas.removeEventListener("pointerup", this.onPointerUp);
		this.canvas.removeEventListener("pointercancel", this.onPointerUp);
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
	}
	unlock() {
		this.sfx.unlock();
	}
	frame(dt) {
		if (this.W < 20 || this.H < 20) this.resize();
		this.syncMusic();
		this.sfx.score.advance();
		this.acc += Math.min(.05, Math.max(0, dt));
		const step = 1 / 60;
		let guard = 0;
		while (this.acc >= step && guard++ < 4) {
			this.sim(step);
			this.acc -= step;
		}
		this.draw();
	}
	syncMusic() {
		const live = this.phase === "play" || this.phase === "serve";
		this.sfx.score.heat = live ? this.combo : 0;
		if (this.phase === "shatter") this.sfx.score.setScene("break");
		else if (live) this.sfx.score.setScene(this.hyper ? "hyper" : "match");
		else this.sfx.score.setScene("menu");
	}
	start(vsAI) {
		if ((this.phase === "serve" || this.phase === "play" || this.phase === "shatter") && !this.paused) return;
		if (this.time - this.lastStart < .25 && this.phase !== "demo" && this.phase !== "end" && !this.paused) return;
		this.lastStart = this.time;
		this.paused = false;
		this.hooks.pause(false);
		this.versusAi = vsAI;
		this.ended = false;
		this.lesson = this.plays < 1;
		this.plays += 1;
		this.contacts = 0;
		this.nudged = false;
		this.tipUntil = 0;
		this.cardOn = false;
		this.ghostOn = false;
		try {
			localStorage.setItem("hyper-strike-plays", String(this.plays));
		} catch {}
		this.resetRound();
		this.hooks.onLive({
			top: vsAI ? "BOT" : "P2",
			bottom: "YOU"
		});
		this.coach = this.lesson;
		this.hooks.coach(this.lesson);
		this.hooks.card(false);
		this.hooks.ghost(false);
		this.hooks.tip("");
		this.placeBall(Math.random() < .5 ? 1 : -1, false);
		this.burst(this.W / 2, this.H / 2, CYAN, 30, 480, false);
		this.blip(() => this.sfx.serve());
		this.emitHud(true);
	}
	toMenu() {
		this.ended = false;
		this.hitstop = 0;
		this.paused = false;
		this.hooks.pause(false);
		this.hooks.card(false);
		this.hooks.ghost(false);
		this.hooks.tip("");
		this.hooks.coach(false);
		this.resetRound();
		this.phase = "demo";
		this.placeBall(Math.random() < .5 ? 1 : -1, true);
		this.hooks.onMenu();
		this.emitHud(true);
	}
	toggleMute() {
		const next = !this.sfx.muted;
		this.sfx.unlock();
		this.sfx.setMuted(next);
		try {
			localStorage.setItem("hyper-strike-mute", next ? "1" : "0");
		} catch {}
		this.hooks.prefs(this.prefSnapshot());
	}
	setEasy(easy) {
		this.easy = easy;
		try {
			localStorage.setItem("hyper-strike-easy", easy ? "1" : "0");
		} catch {}
		this.hooks.prefs(this.prefSnapshot());
	}
	setTips(tips) {
		this.tips = tips;
		try {
			localStorage.setItem("hyper-strike-tips", tips ? "1" : "0");
		} catch {}
		this.hooks.prefs(this.prefSnapshot());
	}
	togglePause() {
		if (!(this.phase === "play" || this.phase === "serve") && !this.paused) return;
		this.paused = !this.paused;
		if (this.paused) {
			this.ghostOn = false;
			this.hooks.ghost(false);
		}
		this.hooks.pause(this.paused);
	}
	prefSnapshot() {
		return {
			muted: this.sfx.muted,
			shake: this.shakeOn,
			easy: this.easy,
			tips: this.tips
		};
	}
	toggleShake() {
		this.shakeOn = !this.shakeOn;
		try {
			localStorage.setItem("hyper-strike-shake", this.shakeOn ? "1" : "0");
		} catch {}
		this.hooks.prefs(this.prefSnapshot());
	}
	setKeys(codes) {
		this.keys.clear();
		for (const code of codes) this.keys.add(code);
	}
	snapshot() {
		return {
			phase: this.phase,
			p1x: this.p1.x,
			p2x: this.p2.x,
			p1hp: this.p1.hp,
			p2hp: this.p2.hp,
			p1shields: this.p1.shields,
			p2shields: this.p2.shields,
			armed: this.ballIsHot(),
			hyper: this.hyper,
			combo: this.combo,
			vsAI: this.versusAi
		};
	}
	/** QA: drop an armed ball onto the bottom paddle. */
	debugStrike(edge) {
		this.phase = "play";
		this.hitstop = 0;
		this.lock = 0;
		this.hyper = false;
		this.ball.fireUntil = 0;
		this.ball.armed = true;
		this.ended = false;
		const off = edge ? this.p1.w * .42 : 0;
		this.ball.x = this.p1.x + off;
		this.ball.y = this.p1.y - 48;
		this.ball.dx = 0;
		this.ball.dy = 980;
	}
	debugShield() {
		this.p1.shields = 1;
		this.emitHud(true);
	}
	loadPrefs() {
		try {
			this.best = Number(localStorage.getItem("hyper-strike-best") || 0) || 0;
			this.wins = Number(localStorage.getItem("hyper-strike-wins") || 0) || 0;
			this.easy = localStorage.getItem("hyper-strike-easy") !== "0";
			this.tips = localStorage.getItem("hyper-strike-tips") !== "0";
			this.plays = Number(localStorage.getItem("hyper-strike-plays") || 0) || 0;
			const chips = localStorage.getItem("hyper-strike-chips");
			if (chips) {
				for (const id of chips.split(",")) if (id) this.chips.add(id);
			}
			const seen = localStorage.getItem("hyper-strike-seen");
			if (seen) {
				for (const id of seen.split(",")) if (id) this.seen.add(id);
			}
			if (localStorage.getItem("hyper-strike-mute") === "1") this.sfx.setMuted(true);
			const shake = localStorage.getItem("hyper-strike-shake");
			if (shake === "0") this.shakeOn = false;
			if (shake === "1") this.shakeOn = true;
			const meta = loadMeta();
			this.trailId = meta.trail;
			this.skinId = meta.skin;
			this.theme = meta.theme;
			this.sfx.setTheme(meta.theme);
			const savedMode = localStorage.getItem("hyper-strike-mode");
			if (savedMode === "survival" || savedMode === "speed" || savedMode === "chaos" || savedMode === "duel") this.mode = savedMode;
		} catch {}
	}
	makePaddle(id, color) {
		return {
			id,
			x: 200,
			y: id === "p1" ? 600 : 48,
			w: 120,
			baseW: 120,
			h: 16,
			hp: MAX_HP,
			prevHp: MAX_HP,
			shields: 0,
			widthMul: 1,
			widthUntil: 0,
			color,
			impact: 0,
			flash: 0,
			mood: "idle",
			moodUntil: 0,
			wiggle: 0,
			frozenUntil: 0
		};
	}
	resize = () => {
		const rect = this.canvas.getBoundingClientRect();
		const w = rect.width || window.innerWidth;
		const h = rect.height || window.innerHeight;
		this.dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.W = Math.max(280, w);
		this.H = Math.max(360, h);
		this.canvas.width = Math.floor(this.W * this.dpr);
		this.canvas.height = Math.floor(this.H * this.dpr);
		this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		this.scale = Math.max(.78, Math.min(1.22, this.H / 800));
		const base = Math.max(96, Math.min(168, this.W * .28));
		this.p1.baseW = base;
		this.p2.baseW = base;
		this.p1.h = 16;
		this.p2.h = 16;
		this.p2.y = 72;
		this.p1.y = this.H - 112;
		this.refreshWidth(this.p1);
		this.refreshWidth(this.p2);
		this.clamp(this.p1);
		this.clamp(this.p2);
	};
	bind() {
		this.canvas.addEventListener("pointerdown", this.onPointerDown, { passive: false });
		this.canvas.addEventListener("pointermove", this.onPointerMove, { passive: false });
		this.canvas.addEventListener("pointerup", this.onPointerUp);
		this.canvas.addEventListener("pointercancel", this.onPointerUp);
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
	}
	onPointerDown = (e) => {
		try {
			this.canvas.setPointerCapture(e.pointerId);
		} catch {}
		e.preventDefault();
		this.sfx.unlock();
		this.trackPointer(e);
	};
	onPointerMove = (e) => {
		if (!this.pts.has(e.pointerId)) return;
		e.preventDefault();
		this.trackPointer(e);
	};
	onPointerUp = (e) => {
		this.pts.delete(e.pointerId);
	};
	trackPointer(e) {
		const rect = this.canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) / Math.max(1, rect.width) * this.W;
		const y = (e.clientY - rect.top) / Math.max(1, rect.height) * this.H;
		this.pts.set(e.pointerId, {
			x,
			y
		});
	}
	onKeyDown = (e) => {
		this.keys.add(e.code);
		if ([
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Space"
		].includes(e.code)) e.preventDefault();
		if (e.repeat) return;
		this.sfx.unlock();
		if (e.code === "Digit1") this.emote(this.p1, "GG");
		if (e.code === "Digit2") this.emote(this.p1, "WOW");
		if (e.code === "Digit3") this.emote(this.p1, "NOPE");
		if (e.code === "Digit4") this.emote(this.p1, "HI");
		if (!this.versusAi) {
			if (e.code === "Digit7") this.emote(this.p2, "GG");
			if (e.code === "Digit8") this.emote(this.p2, "WOW");
			if (e.code === "Digit9") this.emote(this.p2, "NOPE");
			if (e.code === "Digit0") this.emote(this.p2, "HI");
		}
		if (e.code === "Escape") {
			e.preventDefault();
			this.togglePause();
		}
		if ((e.code === "Space" || e.code === "Enter") && this.phase === "demo") this.hooks.quickStart();
		if ((e.code === "Space" || e.code === "Enter") && this.phase === "end") this.hooks.rematch();
	};
	onKeyUp = (e) => {
		this.keys.delete(e.code);
	};
	resetRound() {
		for (const p of [this.p1, this.p2]) {
			p.hp = MAX_HP;
			p.prevHp = MAX_HP;
			p.shields = 0;
			p.widthMul = 1;
			p.widthUntil = 0;
			p.impact = 0;
			p.flash = 0;
			p.mood = "idle";
			p.moodUntil = 0;
			p.wiggle = 0;
			p.frozenUntil = 0;
			p.w = p.baseW;
			p.x = this.W / 2;
		}
		this.orbs = [];
		this.clones = [];
		this.floats = [];
		this.trail = [];
		this.combo = 0;
		this.score = 0;
		this.hits = 0;
		this.maxSpeed = 0;
		this.pickups = 0;
		this.useful = 0;
		this.spikes = 0;
		this.bestCombo = 0;
		this.hyper = false;
		this.roundTime = 0;
		this.lock = 0;
		this.hitstop = 0;
		this.trauma = 0;
		this.flash = 0;
		this.orbTimer = 1.05;
		this.spawns = 0;
		this.pityUsed = false;
		this.firstCrack = false;
		this.shatterT = 0;
		this.ball.fireUntil = 0;
		this.ball.armed = false;
		this.ball.curve = 0;
		this.ball.life = 0;
		this.aiAim = 0;
		this.demoAim = 0;
	}
	placeBall(dir, immediate) {
		this.ball.x = this.W / 2;
		this.ball.y = this.H / 2;
		this.ball.r = 8;
		this.trail = [];
		this.serveDir = dir;
		if (immediate) this.applyLaunch(dir);
		else {
			this.ball.dx = 0;
			this.ball.dy = 0;
			this.ball.armed = false;
			this.serveT = .7;
			this.phase = "serve";
		}
	}
	applyLaunch(dir) {
		const ang = Math.random() * .75 - .375;
		const spd = (this.phase === "demo" ? 470 : this.easy ? 300 : 510) * this.scale * (this.lesson && this.contacts < 3 ? .62 : 1);
		this.ball.dy = dir * Math.cos(ang) * spd;
		this.ball.dx = Math.sin(ang) * spd * 1.15;
		const calm = this.p1.hp === MAX_HP && this.p2.hp === MAX_HP;
		const stillFire = this.time < this.ball.fireUntil;
		this.ball.armed = stillFire || this.hyper || !this.easy && !calm && Math.random() < .4;
		this.lastHit = dir > 0 ? "p2" : "p1";
		this.prevDy = this.ball.dy < 0 ? 1 : -1;
		this.noteAimFlip();
		if (this.ball.armed && this.phase !== "demo" && !stillFire) this.shout(this.hyper ? "HYPER" : "SPIKE", "amber", 3, this.hyper ? "every touch cracks" : "serve");
	}
	launch() {
		this.phase = "play";
		this.applyLaunch(this.serveDir);
		this.blip(() => this.sfx.serve());
	}
	sim(dt) {
		if (this.paused) return;
		this.time += dt;
		this.decayJuice(dt);
		if (this.phase === "shatter") {
			this.shatterT += dt;
			if (this.hitstop > 0) this.hitstop = Math.max(0, this.hitstop - dt);
			if (this.shatterT >= 1.05) this.finish();
			return;
		}
		if (this.phase === "end") return;
		if (this.hitstop > 0) {
			this.hitstop -= dt;
			return;
		}
		this.readPointers();
		this.control(dt);
		this.refreshWidth(this.p1);
		this.refreshWidth(this.p2);
		this.clamp(this.p1);
		this.clamp(this.p2);
		this.tickOrbs(dt);
		if (this.phase === "serve") {
			this.serveT -= dt;
			if (this.serveT <= 0) this.launch();
			this.emitHud(false);
			return;
		}
		if (this.phase === "play") {
			this.roundTime += dt;
			this.checkHyper();
			this.heartbeat();
			this.syncLesson();
			if (this.tipUntil && this.time > this.tipUntil) {
				this.tipUntil = 0;
				this.hooks.tip("");
			}
			if (this.coach && !this.lesson && this.roundTime > 6.5) this.hideCoach();
		}
		this.stepBall(dt);
		this.emitHud(false);
	}
	control(dt) {
		const live = this.phase === "play" || this.phase === "serve";
		if (this.phase === "demo") {
			this.drive(this.p1, dt, true);
			this.drive(this.p2, dt, true);
			return;
		}
		if (!live) return;
		const v = 840 * this.scale * dt;
		if (this.time >= this.p1.frozenUntil) {
			if (this.aim1 == null) {
				if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) this.p1.x -= v;
				if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) this.p1.x += v;
			} else this.p1.x = this.aim1;
		}
		if (this.versusAi) {
			if (this.time >= this.p2.frozenUntil) this.drive(this.p2, dt, false);
		} else if (this.time < this.p2.frozenUntil) {} else if (this.aim2 == null) {
			if (this.keys.has("KeyJ")) this.p2.x -= v;
			if (this.keys.has("KeyL")) this.p2.x += v;
		} else this.p2.x = this.aim2;
	}
	readPointers() {
		this.aim1 = null;
		this.aim2 = null;
		if (this.phase === "demo" || this.phase === "end" || this.phase === "shatter" || this.paused) return;
		for (const p of this.pts.values()) if (p.y > this.H * .5) this.aim1 = p.x;
		else if (!this.versusAi) this.aim2 = p.x;
	}
	drive(p, dt, demo) {
		const coming = p.id === "p1" ? this.ball.dy > 20 : this.ball.dy < -20;
		let target = this.W / 2;
		if (coming) {
			const face = p.id === "p1" ? p.y : p.y + p.h;
			const aim = p.id === "p1" ? this.demoAim : this.aiAim;
			target = this.predictX(face) + aim;
			target = Math.max(24, Math.min(this.W - 24, target));
			const orb = this.nearestOrb(target, p.id);
			if (orb) target = orb.x;
		}
		const hot = coming && this.ballIsHot();
		let maxV = (demo ? 760 : hot ? 690 : 575) * this.scale;
		if (this.easy && !demo && p.id === "p2") maxV *= .46;
		if (this.easy && !demo && p.id === "p2" && (this.p1.hp <= 1 || this.crushed())) maxV *= .45;
		const diff = target - p.x;
		p.x += Math.max(-maxV * dt, Math.min(maxV * dt, diff));
	}
	predictX(faceY) {
		const dy = this.ball.dy;
		if (Math.abs(dy) < 40) return this.ball.x;
		const t = (faceY - this.ball.y) / dy;
		return foldX(this.ball.x + this.ball.dx * t, this.W);
	}
	nearestOrb(targetX, who) {
		const mid = this.H / 2;
		let best = null;
		let bestD = 120;
		for (const o of this.orbs) {
			if (o.kind !== "shield" && o.kind !== "repair") continue;
			if (who === "p2" && o.y > mid) continue;
			if (who === "p1" && o.y < mid) continue;
			const d = Math.abs(o.x - targetX);
			if (d < bestD) {
				best = o;
				bestD = d;
			}
		}
		return best;
	}
	noteAimFlip() {
		if (this.prevDy >= 0 && this.ball.dy < 0) this.aiAim = this.pickAim(this.p2);
		if (this.prevDy <= 0 && this.ball.dy > 0) this.demoAim = this.pickAim(this.p1);
		this.prevDy = this.ball.dy;
	}
	pickAim(p) {
		const bot = this.easy && this.versusAi && p.id === "p2" && this.phase !== "demo";
		if (bot && (this.crushed() || this.p1.hp <= 1)) return (Math.random() < .5 ? -1 : 1) * (p.w * .95 + 48);
		if (bot) {
			if (this.roundTime < 20 || Math.random() < .5) return (Math.random() - .5) * p.w * .9;
			return (Math.random() - .5) * p.w * .45;
		}
		if (this.ballIsHot() || p.hp <= 2) return (Math.random() - .5) * 14;
		if (Math.random() < .6) return (Math.random() < .5 ? -1 : 1) * p.w * .46;
		return (Math.random() - .5) * 18;
	}
	crushed() {
		return this.easy && this.versusAi && this.roundTime < 15 && this.p1.hp <= this.p2.hp - 2;
	}
	syncLesson() {
		const card = this.lesson && this.contacts === 0 && this.roundTime < 8;
		if (card !== this.cardOn) {
			this.cardOn = card;
			this.hooks.card(card);
		}
		const ghost = this.lesson && this.roundTime < 5;
		if (ghost !== this.ghostOn) {
			this.ghostOn = ghost;
			this.hooks.ghost(ghost);
		}
	}
	stepBall(dt) {
		const prevY = this.ball.y;
		this.ball.x += this.ball.dx * dt;
		this.ball.y += this.ball.dy * dt;
		if (this.mode === "chaos" && this.phase !== "demo") {
			const sway = Math.sin(this.time * 1.6) * 120;
			const margin = this.ball.r + 40;
			const pinnedLeft = this.ball.x < margin && sway < 0;
			const pinnedRight = this.ball.x > this.W - margin && sway > 0;
			if (!pinnedLeft && !pinnedRight) this.ball.dx += sway * dt;
			const minDy = 280 * this.scale;
			if (Math.abs(this.ball.dy) < minDy) this.ball.dy = Math.sign(this.ball.dy || 1) * minDy;
		}
		if (this.ball.curve) {
			const margin = this.ball.r + 32;
			if (this.ball.x < margin && this.ball.curve < 0) this.ball.curve *= -1;
			else if (this.ball.x > this.W - margin && this.ball.curve > 0) this.ball.curve *= -1;
			else this.ball.dx += this.ball.curve * dt;
			this.ball.curve *= Math.max(0, 1 - dt * .85);
		}
		const spNow = Math.hypot(this.ball.dx, this.ball.dy);
		if (this.phase !== "demo" && spNow > this.maxSpeed) this.maxSpeed = spNow;
		this.trail.push({
			x: this.ball.x,
			y: this.ball.y
		});
		const cap = this.trailId === "comet" ? 18 : this.trailId === "ribbon" ? 12 : 9;
		if (this.trail.length > cap) this.trail.shift();
		const away = 200 * this.scale;
		if (this.ball.x < this.ball.r) {
			this.ball.x = this.ball.r + 2;
			this.ball.dx = Math.max(away, Math.abs(this.ball.dx));
			if (this.ball.curve < 0) this.ball.curve *= -.35;
			this.bumpWall();
		} else if (this.ball.x > this.W - this.ball.r) {
			this.ball.x = this.W - this.ball.r - 2;
			this.ball.dx = -Math.max(away, Math.abs(this.ball.dx));
			if (this.ball.curve > 0) this.ball.curve *= -.35;
			this.bumpWall();
		}
		this.noteAimFlip();
		if (this.lock > 0) this.lock -= dt;
		else if (this.ball.dy < 0) this.tryHit(this.p2, prevY, true);
		else if (this.ball.dy > 0) this.tryHit(this.p1, prevY, false);
		this.collectOrbs();
		if (this.phase === "shatter" || this.phase === "end") return;
		if (this.ball.y < -24) this.whiff(this.p2);
		else if (this.ball.y > this.H + 24) this.whiff(this.p1);
		this.stepClones(dt);
	}
	bumpWall() {
		this.trauma = Math.min(1, this.trauma + .05);
		this.burst(this.ball.x, this.ball.y, FG, 4, 140, false);
	}
	tryHit(p, prevY, top) {
		const forgive = this.easy && this.phase !== "demo" ? 16 : 0;
		const half = p.w / 2 + forgive;
		if (!(this.ball.x + this.ball.r >= p.x - half && this.ball.x - this.ball.r <= p.x + half)) return;
		const r = this.ball.r;
		let crossed = false;
		if (top) {
			const face = p.y + p.h;
			const prevTop = prevY - r;
			const nowTop = this.ball.y - r;
			crossed = this.ball.dy < 0 && prevTop >= face - 2 && nowTop <= face + p.h;
		} else {
			const face = p.y;
			const prevBot = prevY + r;
			const nowBot = this.ball.y + r;
			crossed = this.ball.dy > 0 && prevBot <= face + 2 && nowBot >= face - p.h;
		}
		if (!crossed) return;
		this.resolveHit(p, top);
	}
	resolveHit(p, top) {
		const offsetRaw = Math.max(-1, Math.min(1, (this.ball.x - p.x) / (p.w / 2 || 1)));
		const offset = this.easy && this.versusAi && p.id === "p2" && this.roundTime < 20 && !this.hyper ? Math.max(-.42, Math.min(.42, offsetRaw)) : offsetRaw;
		const spike = Math.abs(offset) >= .68;
		const dir = top ? 1 : -1;
		const speed = Math.hypot(this.ball.dx, this.ball.dy) || 480 * this.scale;
		let next = Math.min(1100 * this.scale, Math.max(430 * this.scale, speed * 1.045 + 20));
		if (this.lesson && this.contacts < 3) next *= .7;
		this.ball.dx = offset * next * (spike ? 1.08 : .78);
		this.ball.dy = dir * Math.max(next * .62, 280 * this.scale);
		if (spike) {
			this.ball.dx *= 1.06;
			this.ball.dy *= 1.05;
		}
		this.cap();
		if (top) this.ball.y = p.y + p.h + this.ball.r + 1;
		else this.ball.y = p.y - this.ball.r - 1;
		this.lock = .09;
		this.hitstop = this.reduced ? .02 : Math.hypot(this.ball.dx, this.ball.dy) > 820 ? .055 : .028;
		this.lastHit = p.id;
		p.impact = 1;
		p.flash = 1;
		if (spike) this.mood(p, "squint");
		const hot = this.ballIsHot();
		const fire = this.time < this.ball.fireUntil;
		const canDefuse = hot && !spike && !this.hyper && !fire;
		this.burst(this.ball.x, this.ball.y, p.color, spike || hot ? 26 : 14, spike ? 380 : 220, false);
		this.trauma = Math.min(1, this.trauma + (spike ? .28 : .12));
		if (this.phase === "demo") {
			this.ball.armed = spike || this.hyper;
			this.combo += 1;
			this.noteAimFlip();
			return;
		}
		if (canDefuse) {
			this.ball.armed = false;
			this.shout("SAVE", "cyan", 3, "middle");
			this.mood(p, "grin");
			this.blip(() => this.sfx.defuse());
			if (!this.lesson) this.hideCoach();
		} else if (hot) {
			const result = this.applyDamage(p, 1);
			if (result === "blocked") {
				this.ball.armed = true;
				this.boost(1.12);
				this.shout("SAFE", "amber", 5, "shield held");
				if (p.id === "p1") this.earn("shield");
				this.mood(p, "grin");
				this.blip(() => this.sfx.parry());
				this.flash = .45;
				this.flashColor = AMBER;
				this.hitstop = this.reduced ? .02 : .05;
				this.trauma = Math.min(1, this.trauma + .35);
				if (!this.lesson) this.hideCoach();
			} else if (result === "hurt") {
				this.ball.armed = spike || this.hyper || fire;
				this.voiceCrack(p);
				this.blip(() => this.sfx.crack());
				this.hitstop = this.reduced ? .02 : .04;
				this.popSegment(p);
				if (!this.lesson) this.hideCoach();
			} else if (result === "dead") {
				this.shatter(p);
				return;
			} else if (result === "none") this.ball.armed = spike;
		} else {
			this.ball.armed = spike;
			if (spike) {
				this.shout("SPIKE", p.id === "p1" ? "cyan" : "magenta", 3, "edge hit");
				if (p.id === "p1") this.earn("spike");
				this.blip(() => this.sfx.spike());
				if (!this.lesson) this.hideCoach();
			} else this.blip(() => this.sfx.hit(500 + Math.min(640, this.combo * 34)));
		}
		this.combo += 1;
		this.contacts += 1;
		if (this.combo > this.bestCombo) this.bestCombo = this.combo;
		if (this.combo >= 5) this.earn("rally");
		if (this.combo === 6 && !this.ballIsHot()) this.ball.armed = true;
		if (this.lesson && p.id === "p1" && this.contacts <= 4) {
			if (spike) this.shout("EDGE · SPIKE", "amber", 9, "Edge arms a crack");
			else if (!hot || canDefuse) this.shout("MIDDLE · SAVE", "cyan", 9, "Middle stays calm");
		} else if (this.combo === 3) this.shout("SWEET", "amber", 6, "3 hits");
		else if (this.combo === 6) this.shout("BANANA", "amber", 7, "6 hits");
		else if (this.combo === 10) this.shout("LEGEND", "magenta", 8, "10 hits");
		if (this.combo === 4) this.shout("HOT STREAK!", "amber", 7, `${this.multiplier().toFixed(1)}x`);
		else if (this.combo === 8) this.shout("UNSTOPPABLE!", "magenta", 8, `${this.multiplier().toFixed(1)}x`);
		if (this.combo === 3 || this.combo === 6 || this.combo === 10) this.blip(() => this.sfx.rally());
		if (p.id === "p1" && spike) this.spikes += 1;
		this.bankHit();
		this.noteAimFlip();
	}
	multiplier() {
		return Math.min(8, Number(Math.pow(1.35, Math.max(0, this.combo - 1)).toFixed(2)));
	}
	bankHit() {
		if (this.phase === "demo") return;
		this.hits += 1;
		const spd = Math.hypot(this.ball.dx, this.ball.dy);
		const gain = Math.round(45 * this.multiplier() * (1 + Math.min(1, spd / 1400)));
		this.score += gain;
		this.float(this.ball.x, this.ball.y - 14, `+${gain}`, AMBER);
	}
	spawnClones() {
		for (let i = 0; i < 2; i++) this.clones.push({
			x: this.ball.x,
			y: this.ball.y,
			r: 7,
			dx: this.ball.dx * .65 + (i === 0 ? -220 : 220),
			dy: this.ball.dy * .8,
			armed: false,
			fireUntil: 0,
			curve: 0,
			life: 5.5
		});
	}
	stepClones(dt) {
		for (let i = this.clones.length - 1; i >= 0; i--) {
			const b = this.clones[i];
			b.life -= dt;
			b.x += b.dx * dt;
			b.y += b.dy * dt;
			if (b.x < b.r) {
				b.x = b.r;
				b.dx = Math.abs(b.dx);
			} else if (b.x > this.W - b.r) {
				b.x = this.W - b.r;
				b.dx = -Math.abs(b.dx);
			}
			for (const p of [this.p1, this.p2]) {
				const face = p.id === "p2" ? p.y + p.h : p.y;
				if (!(Math.abs(b.x - p.x) < p.w / 2 + b.r && Math.abs(b.y - (p.y + p.h / 2)) < p.h / 2 + b.r + 6 && (p.id === "p2" && b.dy < 0 || p.id === "p1" && b.dy > 0))) continue;
				b.dy = p.id === "p1" ? -Math.abs(b.dy) : Math.abs(b.dy);
				b.y = p.id === "p1" ? face - b.r - 2 : face + b.r + 2;
				this.burst(b.x, b.y, p.color, 10, 220, false);
				if (p.id === "p1" && this.phase !== "demo") {
					this.score += 30;
					this.float(b.x, b.y - 12, "+30", CYAN);
				}
			}
			if (b.life <= 0 || b.y < -30 || b.y > this.H + 30) this.clones.splice(i, 1);
		}
	}
	emote(p, text) {
		if (this.phase !== "play" && this.phase !== "serve") return;
		const y = p.id === "p1" ? p.y - 28 : p.y + p.h + 28;
		this.float(p.x, y, text, p.id === "p1" ? CYAN : MAGENTA);
		this.burst(p.x, y, AMBER, 8, 160, false);
	}
	setMode(mode) {
		this.mode = mode;
		try {
			localStorage.setItem("hyper-strike-mode", mode);
		} catch {}
	}
	setLook(kind, id) {
		const meta = loadMeta();
		if (kind === "trail") {
			this.trailId = id;
			meta.trail = this.trailId;
		} else if (kind === "skin") {
			this.skinId = id;
			meta.skin = this.skinId;
		} else {
			this.theme = id;
			meta.theme = this.theme;
			this.sfx.setTheme(this.theme);
		}
		saveMeta(meta);
	}
	voiceCrack(p) {
		this.mood(p, "squint");
		this.float(p.x, p.id === "p1" ? p.y - 18 : p.y + 28, "-1", p.color);
		this.crackCall(p);
		this.trauma = Math.min(1, this.trauma + .4);
		this.flash = .28;
		this.flashColor = p.color;
		this.maybePity(p);
	}
	crackCall(p) {
		const tone = p.id === "p1" ? "cyan" : "magenta";
		if (p.hp <= 1) this.shout("LAST HIT · PADDLE POPS", tone, 8, "One more and it pops");
		else if (p.hp === 2) this.shout("CRACKING", tone, 5, "Two hearts left");
		else if (!this.firstCrack) {
			this.firstCrack = true;
			this.shout("CRACK", tone, 4, "First heart gone");
		} else this.shout("CRACK", tone, 4, `${p.hp} hearts left`);
		if (p.id === "p1") this.maybeNudge();
	}
	maybeNudge() {
		if (!this.tips || this.nudged || this.lesson || !this.versusAi) return;
		if (this.p2.hp < MAX_HP || this.p1.hp > 3) return;
		this.nudged = true;
		this.tipUntil = this.time + 4.2;
		this.hooks.tip("Try the EDGE for SPIKE");
	}
	earn(id) {
		if (this.chips.has(id)) return;
		this.chips.add(id);
		try {
			localStorage.setItem("hyper-strike-chips", [...this.chips].join(","));
		} catch {}
	}
	maybePity(p) {
		if (this.pityUsed || p.hp <= 0 || p.hp > 2) return;
		this.pityUsed = true;
		if (!this.orbs.some((o) => o.kind === "shield")) this.spawnOrb("shield");
	}
	whiff(victim) {
		if (this.phase === "shatter" || this.phase === "end") return;
		if (this.mode === "survival" && victim.id === "p2") {
			this.combo = 0;
			this.placeBall(1, false);
			return;
		}
		const y = victim.id === "p1" ? this.H - 36 : 40;
		this.burst(this.ball.x, y, victim.color, 20, 340, false);
		if (this.phase === "demo") {
			this.combo = 0;
			this.placeBall(victim.id === "p1" ? 1 : -1, true);
			return;
		}
		const amount = this.ballIsHot() ? 2 : 1;
		const result = this.applyDamage(victim, amount);
		this.combo = 0;
		if (result === "blocked") {
			this.shout("SAVED", "amber", 5);
			this.blip(() => this.sfx.parry());
			this.flash = .4;
			this.flashColor = AMBER;
			this.hideCoach();
		} else if (result === "hurt") {
			this.float(victim.x, y, amount === 2 ? "-2" : "-1", victim.color);
			this.popSegment(victim);
			this.blip(() => this.sfx.crack());
			this.trauma = Math.min(1, this.trauma + .5);
			this.hitstop = this.reduced ? .02 : .05;
			this.mood(victim, "squint");
			this.mood(victim.id === "p1" ? this.p2 : this.p1, "grin");
			this.crackCall(victim);
			this.maybePity(victim);
			this.hideCoach();
			if (!this.versusAi) {
				this.shout("YOUR POINT", victim.id === "p2" ? "cyan" : "magenta", 9);
				this.blip(() => this.sfx.honk());
			}
		} else if (result === "dead") {
			this.shatter(victim);
			return;
		}
		this.placeBall(victim.id === "p1" ? 1 : -1, false);
	}
	applyDamage(p, amount) {
		if (this.phase === "demo" || amount <= 0) return "none";
		if (this.mode === "survival" && p.id === "p2") return "none";
		if (p.shields > 0) {
			p.shields -= 1;
			return "blocked";
		}
		p.hp = Math.max(0, p.hp - amount);
		if (p.hp <= 0) return "dead";
		return "hurt";
	}
	popSegment(p) {
		const lost = p.prevHp - p.hp;
		p.prevHp = p.hp;
		if (lost <= 0) return;
		const segW = p.w / 5;
		const left = p.x - p.w / 2;
		for (let i = p.hp; i < p.hp + lost; i++) {
			const x = left + segW * (i + .5);
			this.burst(x, p.y + p.h / 2, p.color, 8, 260, true);
		}
	}
	mood(p, mood) {
		p.mood = mood;
		p.moodUntil = this.time + (mood === "grin" ? .55 : .32);
	}
	shatter(p) {
		if (this.ended || this.phase === "shatter") return;
		p.hp = 0;
		p.prevHp = 0;
		this.loser = p.id;
		this.phase = "shatter";
		this.shatterT = 0;
		this.hitstop = this.reduced ? .03 : .08;
		this.trauma = .35;
		this.flash = .22;
		this.flashColor = AMBER;
		this.ball.dx = 0;
		this.ball.dy = 0;
		const winner = p.id === "p1" ? this.p2 : this.p1;
		winner.wiggle = 1;
		winner.mood = "grin";
		winner.moodUntil = this.time + 1.2;
		this.stars(p.x, p.y + p.h / 2, 36);
		this.burst(p.x, p.y + p.h / 2, AMBER, 22, 460, false);
		this.shout("POP!", p.id === "p1" ? "magenta" : "cyan", 10, "paddle popped");
		this.blip(() => this.sfx.shatter());
		this.hideCoach();
		this.emitHud(true);
	}
	finish() {
		if (this.ended) return;
		this.ended = true;
		this.phase = "end";
		const youWin = this.loser === "p2";
		if (youWin) {
			this.wins += 1;
			try {
				localStorage.setItem("hyper-strike-wins", String(this.wins));
			} catch {}
		}
		if (this.versusAi) {
			this.streak = youWin ? this.streak + 1 : 0;
			if (this.streak > this.best) {
				this.best = this.streak;
				try {
					localStorage.setItem("hyper-strike-best", String(this.best));
				} catch {}
			}
		}
		if (youWin && this.mode === "speed") this.score += Math.round(7e3 / Math.max(5, this.roundTime));
		const meta = loadMeta();
		noteChallenge(meta, meta.challenge.id, meta.challenge.id === "rally" ? this.bestCombo : meta.challenge.id === "pickups" ? this.pickups : meta.challenge.id === "spikes" ? this.spikes : this.score);
		const xp = grantXp(meta, this.score, youWin);
		saveMeta(meta);
		const efficiency = this.pickups ? Math.round(100 * this.useful / this.pickups) : 0;
		const starWin = youWin;
		const starRally = this.bestCombo >= 5;
		const starHp = youWin && this.p1.hp >= 2;
		if (starRally) this.earn("rally");
		if (youWin && this.easy && this.versusAi) this.earn("easy");
		const ko = youWin ? this.versusAi ? "Bot paddle popped" : "P2 paddle popped" : "Your paddle popped";
		this.hooks.coach(false);
		this.hooks.card(false);
		this.hooks.ghost(false);
		this.hooks.onEnd({
			youWin,
			vsAI: this.versusAi,
			rally: this.bestCombo,
			streak: this.versusAi ? this.streak : 0,
			best: this.best,
			seconds: Math.max(1, Math.round(this.roundTime)),
			winnerHp: youWin ? this.p1.hp : this.p2.hp,
			stars: Number(starWin) + Number(starRally) + Number(starHp),
			wins: this.wins,
			prize: prizeLine(this.wins),
			ko,
			nextTry: youWin ? null : "Next try: EDGE for SPIKE",
			chips: [...this.chips],
			score: this.score,
			mode: this.mode,
			xpGain: xp.gain,
			level: xp.level,
			xpHave: xp.slice.have,
			xpNeed: xp.slice.need,
			unlocked: xp.unlocked,
			stats: {
				rally: this.bestCombo,
				speed: Math.round(this.maxSpeed),
				efficiency,
				hits: this.hits
			},
			challenge: meta.challenge,
			needsInitials: qualifies(meta.board, this.score)
		});
		this.sfx.score.flourish(youWin);
	}
	checkHyper() {
		const at = this.easy && this.versusAi ? 24 : HYPER_AT;
		if (this.hyper || this.roundTime < at) return;
		this.hyper = true;
		this.ball.armed = true;
		this.aiAim = 0;
		this.demoAim = 0;
		this.flash = .5;
		this.flashColor = MAGENTA;
		this.trauma = Math.min(1, this.trauma + .45);
		this.shout("HYPER", "magenta", 6, "every touch cracks");
		this.blip(() => this.sfx.rally());
	}
	heartbeat() {
		if (this.p1.hp !== 1 && this.p2.hp !== 1) return;
		if (this.time - this.lastBeat < .72) return;
		this.lastBeat = this.time;
		this.blip(() => this.sfx.heart());
	}
	ballIsHot() {
		return this.ball.armed || this.time < this.ball.fireUntil || this.hyper;
	}
	tickOrbs(dt) {
		this.orbTimer -= dt;
		if (this.orbTimer <= 0) {
			this.orbTimer = 2.5 + Math.random() * 1.2;
			this.spawnOrb();
		}
		for (let i = this.orbs.length - 1; i >= 0; i--) {
			const o = this.orbs[i];
			o.age += dt;
			o.y += Math.sin(this.time * 2.2 + o.seed) * 10 * dt;
			if (o.age >= o.ttl) this.orbs.splice(i, 1);
		}
	}
	spawnOrb(forced, x, y) {
		if (!forced && this.orbs.length >= 2) return;
		if (this.orbs.length >= 3) return;
		const kind = forced ?? this.rollOrb();
		this.orbs.push({
			kind,
			x: x ?? 40 + Math.random() * (this.W - 80),
			y: y ?? this.H * .28 + Math.random() * this.H * .44,
			r: 18,
			age: 0,
			ttl: 8.5,
			seed: Math.random() * 6
		});
	}
	rollOrb() {
		if (this.spawns === 0) {
			this.spawns += 1;
			return "shield";
		}
		this.spawns += 1;
		let total = 0;
		for (const o of ORB_WEIGHTS) total += o.w;
		let roll = Math.random() * total;
		for (const o of ORB_WEIGHTS) {
			roll -= o.w;
			if (roll <= 0) return o.kind;
		}
		return "shield";
	}
	collectOrbs() {
		for (let i = this.orbs.length - 1; i >= 0; i--) {
			const o = this.orbs[i];
			const dx = this.ball.x - o.x;
			const dy = this.ball.y - o.y;
			const rr = this.ball.r + o.r + 6;
			if (dx * dx + dy * dy <= rr * rr) {
				this.orbs.splice(i, 1);
				this.collect(o);
			}
		}
	}
	owner() {
		return this.lastHit === "p2" ? this.p2 : this.p1;
	}
	collect(o) {
		const me = this.owner();
		const foe = me === this.p1 ? this.p2 : this.p1;
		const color = o.kind === "fire" || o.kind === "shrink" ? MAGENTA : o.kind === "shield" || o.kind === "repair" ? AMBER : CYAN;
		this.burst(o.x, o.y, color, 18, 260, false);
		if (this.phase === "demo") {
			if (o.kind === "wide") {
				me.widthMul = 1.7;
				me.widthUntil = this.time + 4;
			}
			return;
		}
		this.blip(() => this.sfx.pickup());
		if (o.kind === "mystery") {
			const pool = [
				"shield",
				"repair",
				"wide",
				"fire",
				"slow",
				"multi",
				"freeze",
				"curve",
				"burst"
			];
			o.kind = pool[Math.floor(Math.random() * pool.length)];
		}
		this.pickups += 1;
		if (o.kind === "shield") {
			if (me.shields < 2) {
				me.shields += 1;
				this.float(o.x, o.y, "+SHIELD", AMBER);
				this.shout("SAFE", "amber", 4, "shield");
				this.teach("shield", "SAFE blocks the next crack.");
			} else this.shout("SAFE", "amber", 2, "already full");
		} else if (o.kind === "repair") {
			if (me.hp < MAX_HP) {
				me.hp += 1;
				me.prevHp = me.hp;
				this.float(me.x, me.id === "p1" ? me.y - 16 : me.y + 26, "+1", AMBER);
				this.shout("HEAL", "amber", 4, "+1 HP");
				this.teach("repair", "HEAL puts a heart back.");
				this.useful += 1;
			} else if (me.shields < 2) {
				me.shields += 1;
				this.shout("SAFE", "amber", 4, "shield");
				this.teach("shield", "SAFE blocks the next crack.");
			} else {
				this.boost(1.12);
				this.shout("ZOOM", "cyan", 3, "ball speeds");
			}
		} else if (o.kind === "wide") {
			me.widthMul = 1.72;
			me.widthUntil = this.time + 6.5;
			this.shout("PANCAKE", "cyan", 3, "wider paddle");
			this.teach("wide", "PANCAKE makes your paddle wider.");
			this.useful += 1;
		} else if (o.kind === "multi") {
			this.spawnClones();
			this.shout("MULTI", "cyan", 4, "extra balls");
			this.teach("multi", "MULTI adds extra balls. They score, they don't crack.");
			this.useful += 1;
		} else if (o.kind === "freeze") {
			foe.frozenUntil = this.time + 1.6;
			this.shout("FREEZE", "cyan", 4, "they stop");
			this.teach("freeze", "FREEZE locks their paddle for a moment.");
			this.useful += 1;
		} else if (o.kind === "curve") {
			this.ball.curve = (Math.random() < .5 ? -1 : 1) * 280 * this.scale;
			this.shout("CURVE", "amber", 4, "ball bends");
			this.teach("curve", "CURVE bends the ball sideways.");
			this.useful += 1;
		} else if (o.kind === "shrink") {
			foe.widthMul = .56;
			foe.widthUntil = this.time + 5.5;
			this.shout("TINY", "magenta", 3, "they shrink");
			this.teach("shrink", "TINY shrinks their paddle.");
		} else if (o.kind === "fire") {
			this.ball.fireUntil = this.time + 5;
			this.ball.armed = true;
			this.boost(1.08);
			this.shout("HOT POTATO", "magenta", 4, "ball burns");
			this.teach("fire", "HOT POTATO cracks on every hit.");
		} else if (o.kind === "slow") {
			this.ball.dx *= .58;
			this.ball.dy *= .58;
			const m = Math.hypot(this.ball.dx, this.ball.dy);
			const min = 250 * this.scale;
			if (m > 0 && m < min) {
				this.ball.dx *= min / m;
				this.ball.dy *= min / m;
			}
			this.shout("SLOW-MO", "fg", 3, "ball slows");
			this.teach("slow", "SLOW-MO eases the ball.");
		} else {
			this.boost(1.4);
			this.shout("ZOOM", "cyan", 3, "ball speeds");
			this.teach("burst", "ZOOM speeds the ball up.");
		}
		this.emitHud(true);
	}
	cap() {
		const max = (this.easy && this.phase !== "demo" ? 720 : 1080) * this.scale;
		const m = Math.hypot(this.ball.dx, this.ball.dy);
		if (m > max) {
			const s = max / m;
			this.ball.dx *= s;
			this.ball.dy *= s;
		}
	}
	boost(mul) {
		this.ball.dx *= mul;
		this.ball.dy *= mul;
		this.cap();
	}
	refreshWidth(p) {
		const fat = this.easy && this.phase !== "demo" ? 1.2 : 1;
		p.w = (this.time < p.widthUntil ? p.baseW * p.widthMul : p.baseW) * fat;
	}
	clamp(p) {
		const half = p.w / 2;
		p.x = Math.max(half + 8, Math.min(this.W - half - 8, p.x));
	}
	hideCoach() {
		if (!this.coach || this.lesson) return;
		this.coach = false;
		this.hooks.coach(false);
	}
	teach(kind, line) {
		if (this.seen.has(kind)) return;
		this.seen.add(kind);
		try {
			localStorage.setItem("hyper-strike-seen", [...this.seen].join(","));
		} catch {}
		this.hooks.note(line);
	}
	shout(text, tone, priority, sub = "") {
		if (this.phase === "demo") return;
		if (priority < this.shoutPri && this.time < this.shoutUntil) return;
		this.shoutPri = priority;
		this.shoutUntil = this.time + (sub ? .95 : .5);
		this.hooks.shout(text, tone, sub);
	}
	blip(fn) {
		if (this.phase === "demo") return;
		fn();
	}
	float(x, y, text, color) {
		this.floats.push({
			x,
			y,
			text,
			color,
			life: .7,
			max: .7
		});
		if (this.floats.length > 12) this.floats.shift();
	}
	stars(x, y, n) {
		const colors = [
			AMBER,
			CYAN,
			MAGENTA,
			FG
		];
		let left = n;
		for (const p of this.parts) {
			if (left <= 0) break;
			if (p.on) continue;
			const a = Math.random() * Math.PI * 2;
			const s = 80 + Math.random() * 220;
			p.on = true;
			p.x = x;
			p.y = y;
			p.vx = Math.cos(a) * s;
			p.vy = Math.sin(a) * s - 80;
			p.life = p.max = .7 + Math.random() * .45;
			p.color = colors[left % colors.length];
			p.size = 7 + Math.random() * 6;
			p.grav = 90;
			p.rot = Math.random() * 6;
			p.vr = (Math.random() - .5) * 6;
			p.shard = false;
			p.star = true;
			left -= 1;
		}
	}
	burst(x, y, color, n, speed, shard) {
		let left = n;
		for (const p of this.parts) {
			if (left <= 0) break;
			if (p.on) continue;
			const a = Math.random() * Math.PI * 2;
			const s = speed * (.35 + Math.random() * .65);
			p.on = true;
			p.x = x;
			p.y = y;
			p.vx = Math.cos(a) * s;
			p.vy = Math.sin(a) * s - (shard ? 40 : 0);
			p.life = p.max = shard ? .65 + Math.random() * .45 : .28 + Math.random() * .28;
			p.color = color;
			p.size = shard ? 5 + Math.random() * 7 : 2 + Math.random() * 3;
			p.grav = shard ? 520 : 40;
			p.rot = Math.random() * 6;
			p.vr = (Math.random() - .5) * 8;
			p.shard = shard;
			p.star = false;
			left -= 1;
		}
	}
	decayJuice(dt) {
		this.trauma = Math.max(0, this.trauma - dt * 1.65);
		this.flash = Math.max(0, this.flash - dt * 2.4);
		this.p1.impact = Math.max(0, this.p1.impact - dt * 5.5);
		this.p2.impact = Math.max(0, this.p2.impact - dt * 5.5);
		this.p1.flash = Math.max(0, this.p1.flash - dt * 4.5);
		this.p2.flash = Math.max(0, this.p2.flash - dt * 4.5);
		this.p1.wiggle = Math.max(0, this.p1.wiggle - dt * .55);
		this.p2.wiggle = Math.max(0, this.p2.wiggle - dt * .55);
		for (const p of this.parts) {
			if (!p.on) continue;
			p.vy += p.grav * dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.rot += p.vr * dt;
			p.life -= dt;
			if (p.life <= 0) p.on = false;
		}
		for (const f of this.floats) f.life -= dt;
		if (this.floats.some((f) => f.life <= 0)) this.floats = this.floats.filter((f) => f.life > 0);
	}
	emitHud(force) {
		const key = `${this.p1.hp}|${this.p2.hp}|${this.p1.shields}|${this.p2.shields}|${this.combo}|${this.hyper ? 1 : 0}|${this.score}`;
		if (!force && key === this.hudKey) return;
		this.hudKey = key;
		this.hooks.hud({
			p1hp: this.p1.hp,
			p2hp: this.p2.hp,
			p1shields: this.p1.shields,
			p2shields: this.p2.shields,
			combo: this.phase === "demo" ? 0 : this.combo,
			hyper: this.hyper && this.phase !== "demo",
			score: this.phase === "demo" ? 0 : this.score,
			mul: this.phase === "demo" ? 1 : this.multiplier(),
			speed: Math.round(Math.hypot(this.ball.dx, this.ball.dy))
		});
	}
	draw() {
		const ctx = this.ctx;
		ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		ctx.fillStyle = BG;
		ctx.fillRect(0, 0, this.W, this.H);
		ctx.save();
		if (this.shakeOn && this.trauma > .02) {
			const mag = this.trauma * this.trauma * 14;
			const t = this.time * 46;
			ctx.translate(Math.sin(t * 1.7) * mag, Math.cos(t * 2.1) * mag);
		}
		ctx.fillStyle = "rgba(255, 61, 122, 0.045)";
		ctx.fillRect(0, 0, this.W, this.H * .22);
		ctx.fillStyle = "rgba(62, 240, 255, 0.04)";
		ctx.fillRect(0, this.H * .78, this.W, this.H * .22);
		const pulse = this.reduced ? 0 : this.sfx.score.pulse();
		if (pulse > .05) {
			const live = this.phase === "play" || this.phase === "serve" || this.phase === "shatter";
			const hot = this.hyper && live;
			ctx.strokeStyle = hot ? MAGENTA : live ? AMBER : CYAN;
			ctx.globalAlpha = pulse * (hot ? .5 : live ? .32 : .16);
			ctx.lineWidth = 2 + pulse * (hot ? 8 : 4);
			ctx.beginPath();
			ctx.arc(this.W / 2, this.H / 2, 16 + (1 - pulse) * (hot ? 96 : 54), 0, Math.PI * 2);
			ctx.stroke();
			ctx.globalAlpha = 1;
		}
		this.drawMeter();
		for (const o of this.orbs) this.drawOrb(o);
		this.drawPaddle(this.p2);
		this.drawPaddle(this.p1);
		if (this.phase === "play" || this.phase === "serve" || this.phase === "demo" || this.phase === "shatter") this.drawBall();
		this.drawParts();
		this.drawFloats();
		if ((this.phase === "play" || this.phase === "serve") && (this.p1.hp === 1 || this.p2.hp === 1)) {
			const g = ctx.createRadialGradient(this.W / 2, this.H / 2, this.H * .2, this.W / 2, this.H / 2, this.H * .72);
			g.addColorStop(0, "rgba(0,0,0,0)");
			g.addColorStop(1, "rgba(255, 61, 122, 0.18)");
			ctx.fillStyle = g;
			ctx.fillRect(-30, -30, this.W + 60, this.H + 60);
		}
		if (this.flash > 0) {
			ctx.globalAlpha = Math.min(.28, this.flash) * (this.reduced ? .35 : 1);
			ctx.fillStyle = this.flashColor;
			ctx.fillRect(-40, -40, this.W + 80, this.H + 80);
			ctx.globalAlpha = 1;
		}
		ctx.restore();
	}
	drawMeter() {
		const ctx = this.ctx;
		const y = this.H / 2;
		const span = Math.max(40, this.W - 36);
		const left = (this.W - span) / 2;
		ctx.save();
		ctx.strokeStyle = "#1c2230";
		ctx.lineWidth = 2;
		ctx.setLineDash([8, 10]);
		ctx.beginPath();
		ctx.moveTo(left, y);
		ctx.lineTo(left + span, y);
		ctx.stroke();
		ctx.setLineDash([]);
		const u = this.phase === "demo" ? this.time % 10 / 10 : Math.min(1, this.roundTime / HYPER_AT);
		if (u > .01 && this.phase !== "end") {
			ctx.strokeStyle = this.hyper && this.phase !== "demo" ? MAGENTA : AMBER;
			ctx.globalAlpha = .85;
			ctx.lineWidth = this.hyper ? 3 : 2;
			ctx.shadowColor = ctx.strokeStyle;
			ctx.shadowBlur = this.reduced ? 0 : 10;
			ctx.beginPath();
			const half = span * u / 2;
			ctx.moveTo(this.W / 2 - half, y);
			ctx.lineTo(this.W / 2 + half, y);
			ctx.stroke();
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;
		}
		if (this.phase === "play" && !this.hyper && u > .72) {
			ctx.globalAlpha = .55 + Math.sin(this.time * 8) * .35;
			ctx.fillStyle = AMBER;
			ctx.font = "700 12px Outfit, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			ctx.fillText("ARMING", this.W / 2, y - 8);
			ctx.globalAlpha = 1;
		} else if (this.phase === "play" && this.hyper) {
			ctx.fillStyle = MAGENTA;
			ctx.font = "800 12px Outfit, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			ctx.fillText("HYPER", this.W / 2, y - 8);
		}
		ctx.restore();
	}
	drawOrb(o) {
		const ctx = this.ctx;
		const pulse = 1 + Math.sin(this.time * 4 + o.seed) * .08;
		const fade = o.age > o.ttl - 1.2 ? Math.max(0, (o.ttl - o.age) / 1.2) : 1;
		const color = o.kind === "repair" ? MAGENTA : o.kind === "shield" ? AMBER : o.kind === "fire" || o.kind === "shrink" ? MAGENTA : o.kind === "slow" ? "#d5dbe8" : CYAN;
		ctx.save();
		ctx.globalAlpha = fade;
		ctx.translate(o.x, o.y);
		ctx.scale(pulse, pulse);
		ctx.fillStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = this.reduced ? 0 : 16;
		if (o.kind === "shield") {
			shieldPath(ctx, o.r * 1.2);
			ctx.fill();
			ctx.shadowBlur = 0;
			ctx.strokeStyle = "rgba(255,255,255,0.7)";
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.moveTo(0, -o.r * .35);
			ctx.lineTo(0, o.r * .5);
			ctx.stroke();
		} else if (o.kind === "repair") {
			heartPath(ctx, o.r * 1.15);
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.arc(0, 0, o.r, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;
			ctx.fillStyle = BG;
			ctx.font = "800 9px Outfit, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(ORB_LABEL[o.kind], 0, 1);
		}
		ctx.restore();
	}
	drawPaddle(p) {
		const ctx = this.ctx;
		const segs = 5;
		const gap = 3;
		const segW = (p.w - 12) / segs;
		const left = p.x - p.w / 2;
		const jx = p.hp === 1 && (this.phase === "play" || this.phase === "serve") ? Math.sin(this.time * 34) * 1.8 : 0;
		ctx.save();
		ctx.translate(p.x + jx, p.y + p.h / 2);
		const squash = 1 - Math.min(.45, p.impact) * .4;
		if (p.wiggle > .02 && !this.reduced) ctx.rotate(Math.sin(this.time * 26) * .2 * p.wiggle);
		ctx.scale(1 + (1 - squash) * .4, squash);
		ctx.translate(-(p.x + jx), -(p.y + p.h / 2));
		if (p.shields > 0) {
			ctx.strokeStyle = AMBER;
			ctx.lineWidth = 2;
			ctx.shadowColor = AMBER;
			ctx.shadowBlur = this.reduced ? 0 : 12;
			roundRect(ctx, left - 4, p.y - 4, p.w + 8, p.h + 8, 8);
			ctx.stroke();
			ctx.shadowBlur = 0;
		}
		for (let i = 0; i < segs; i++) {
			const x = left + i * (segW + gap);
			const alive = i < p.hp;
			ctx.beginPath();
			roundRect(ctx, x, p.y, segW, p.h, 5);
			const candy = this.skinId === "candy" && alive;
			const voided = this.skinId === "void" && alive;
			ctx.fillStyle = !alive ? "rgba(255,255,255,0.05)" : voided ? i % 2 ? "#14141f" : p.color : candy && i % 2 ? AMBER : p.color;
			ctx.shadowColor = p.color;
			ctx.shadowBlur = alive && !this.reduced ? 14 : 0;
			ctx.fill();
			if (!alive) {
				ctx.shadowBlur = 0;
				ctx.strokeStyle = "rgba(255,255,255,0.14)";
				ctx.lineWidth = 1;
				ctx.stroke();
			} else if (p.flash > .15) {
				ctx.shadowBlur = 0;
				ctx.globalAlpha = Math.min(.85, p.flash);
				ctx.fillStyle = "#ffffff";
				ctx.fill();
				ctx.globalAlpha = 1;
			}
		}
		ctx.shadowBlur = 0;
		if (p.hp > 0 && p.hp < MAX_HP) {
			ctx.strokeStyle = "rgba(255,255,255,0.55)";
			ctx.lineWidth = 1.25;
			const cracks = MAX_HP - p.hp;
			for (let i = 0; i < cracks; i++) {
				const x = left + (i + .5) * p.w / 5;
				ctx.beginPath();
				ctx.moveTo(x - 3, p.y + 2);
				ctx.lineTo(x + 3, p.y + p.h - 2);
				ctx.stroke();
			}
		}
		if (this.time < p.frozenUntil) {
			ctx.strokeStyle = CYAN;
			ctx.lineWidth = 2;
			ctx.shadowBlur = 0;
			roundRect(ctx, left - 3, p.y - 3, p.w + 6, p.h + 6, 7);
			ctx.stroke();
		}
		for (let s = 0; s < p.shields; s++) {
			const side = p.shields === 1 ? 26 : s === 0 ? -28 : 28;
			const sx = p.x + side;
			const sy = p.id === "p1" ? p.y - 6 : p.y + p.h + 6;
			ctx.fillStyle = AMBER;
			ctx.shadowColor = AMBER;
			ctx.shadowBlur = this.reduced ? 0 : 10;
			ctx.save();
			ctx.translate(sx, sy);
			shieldPath(ctx, 11);
			ctx.fill();
			ctx.shadowBlur = 0;
			ctx.strokeStyle = "rgba(255,255,255,0.75)";
			ctx.lineWidth = 1.25;
			ctx.beginPath();
			ctx.moveTo(0, -6);
			ctx.lineTo(0, 6);
			ctx.stroke();
			ctx.restore();
		}
		ctx.shadowBlur = 0;
		this.drawFace(p);
		ctx.restore();
	}
	skin() {
		if (this.wins >= 5) return "robot";
		if (this.wins >= 3) return "pizza";
		if (this.wins >= 1) return "dino";
		return "plain";
	}
	drawFace(p) {
		const ctx = this.ctx;
		const up = p.id === "p1";
		const fy = up ? p.y - 30 : p.y + p.h + 30;
		const skin = p.id === "p1" ? this.skin() : "plain";
		const panic = p.hp === 1 && (this.phase === "play" || this.phase === "serve");
		const squint = !panic && p.mood === "squint" && this.time < p.moodUntil;
		const grin = p.mood === "grin" && this.time < p.moodUntil || skin === "dino";
		const blink = !panic && !squint && Math.sin(this.time * 1.7 + (up ? 0 : 2)) > .97;
		ctx.save();
		ctx.shadowBlur = 0;
		if (skin === "dino") {
			ctx.fillStyle = "#7CFF6B";
			for (let i = -1; i <= 1; i++) {
				ctx.beginPath();
				ctx.moveTo(p.x + i * 9, fy - 16);
				ctx.lineTo(p.x + i * 9 - 5, fy - 6);
				ctx.lineTo(p.x + i * 9 + 5, fy - 6);
				ctx.closePath();
				ctx.fill();
			}
		} else if (skin === "pizza") {
			ctx.fillStyle = AMBER;
			ctx.beginPath();
			ctx.arc(p.x, fy, 12, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = MAGENTA;
			for (const [dx, dy] of [
				[-4, -3],
				[4, 2],
				[1, -5]
			]) {
				ctx.beginPath();
				ctx.arc(p.x + dx, fy + dy, 1.7, 0, Math.PI * 2);
				ctx.fill();
			}
		} else if (skin === "robot") {
			ctx.fillStyle = "#d5dbe8";
			ctx.fillRect(p.x - 11, fy - 9, 22, 18);
			ctx.strokeStyle = CYAN;
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(p.x, fy - 9);
			ctx.lineTo(p.x, fy - 16);
			ctx.stroke();
			ctx.fillStyle = CYAN;
			ctx.beginPath();
			ctx.arc(p.x, fy - 16, 2, 0, Math.PI * 2);
			ctx.fill();
		}
		const open = panic ? 3.3 : squint || blink ? .6 : 2.3;
		for (const dx of [-5, 5]) {
			ctx.fillStyle = skin === "robot" ? BG : FG;
			ctx.beginPath();
			ctx.ellipse(p.x + dx, fy - 1, skin === "robot" ? 2.2 : 2.5, open, 0, 0, Math.PI * 2);
			ctx.fill();
			if (open > 1.2) {
				ctx.fillStyle = skin === "robot" ? CYAN : BG;
				ctx.beginPath();
				ctx.arc(p.x + dx + Math.sin(this.time * 3) * .7, fy - .4, 1, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.strokeStyle = panic ? MAGENTA : skin === "pizza" ? BG : FG;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		if (panic) ctx.arc(p.x, fy + 5, 2.1, 0, Math.PI * 2);
		else if (grin) ctx.arc(p.x, fy + 1.5, 4, .15 * Math.PI, .85 * Math.PI);
		else {
			ctx.moveTo(p.x - 3, fy + 4);
			ctx.lineTo(p.x + 3, fy + 4);
		}
		ctx.stroke();
		ctx.restore();
	}
	drawBall() {
		const ctx = this.ctx;
		for (const b of this.clones) {
			ctx.save();
			ctx.globalAlpha = .85;
			ctx.fillStyle = CYAN;
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
		const fire = this.time < this.ball.fireUntil;
		const hot = this.ballIsHot();
		const sp = Math.hypot(this.ball.dx, this.ball.dy);
		const color = fire || this.hyper ? MAGENTA : sp > 900 ? MAGENTA : sp > 680 || hot ? AMBER : sp > 460 ? CYAN : FG;
		ctx.save();
		for (let i = 0; i < this.trail.length; i++) {
			const t = this.trail[i];
			const k = (i + 1) / this.trail.length;
			ctx.globalAlpha = k * (this.trailId === "comet" ? .55 : .32);
			ctx.fillStyle = color;
			ctx.beginPath();
			if (this.trailId === "ribbon") {
				ctx.save();
				ctx.translate(t.x, t.y);
				ctx.rotate(Math.atan2(this.ball.dy, this.ball.dx));
				ctx.fillRect(-8 * k, -2.2, 16 * k, 4.4);
				ctx.restore();
			} else {
				ctx.arc(t.x, t.y, this.ball.r * (this.trailId === "comet" ? .2 + k * .7 : .45 + k * .4), 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.globalAlpha = 1;
		const stretch = 1 + Math.min(.7, sp / 1600);
		const pulse = this.phase === "serve" ? 1 + Math.sin(this.time * 10) * .08 : 1;
		ctx.translate(this.ball.x, this.ball.y);
		if (sp > 40) ctx.rotate(Math.atan2(this.ball.dy, this.ball.dx));
		ctx.scale(stretch * pulse, pulse / stretch);
		ctx.fillStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = this.reduced ? 0 : hot ? 22 : 12;
		ctx.beginPath();
		ctx.arc(0, 0, this.ball.r + (fire ? 2 : 0), 0, Math.PI * 2);
		ctx.fill();
		if (sp > 760) {
			ctx.shadowBlur = 0;
			ctx.globalAlpha = .45;
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(-this.ball.r - 10, -4);
			ctx.lineTo(-this.ball.r - 26, -4);
			ctx.moveTo(-this.ball.r - 8, 4);
			ctx.lineTo(-this.ball.r - 20, 4);
			ctx.stroke();
		}
		ctx.restore();
	}
	drawParts() {
		const ctx = this.ctx;
		for (const p of this.parts) {
			if (!p.on) continue;
			ctx.globalAlpha = Math.max(0, p.life / p.max);
			ctx.fillStyle = p.color;
			if (p.shard) {
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				ctx.fillRect(-p.size / 2, -p.size * .28, p.size, p.size * .56);
				ctx.restore();
			} else if (p.star) {
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				starPath(ctx, p.size);
				ctx.fill();
				ctx.restore();
			} else ctx.fillRect(p.x, p.y, p.size, p.size);
		}
		ctx.globalAlpha = 1;
	}
	drawFloats() {
		const ctx = this.ctx;
		ctx.font = "800 18px Syne, Outfit, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		for (const f of this.floats) {
			const k = Math.max(0, f.life / f.max);
			ctx.globalAlpha = k;
			ctx.fillStyle = f.color;
			ctx.fillText(f.text, f.x, f.y - (1 - k) * 28);
		}
		ctx.globalAlpha = 1;
	}
};
var TONE = {
	cyan: "var(--color-cyan)",
	magenta: "var(--color-magenta)",
	amber: "var(--color-amber)",
	fg: "var(--color-fg)"
};
var BOOK_URL = "https://www.codeninjas.com/central-edmonton-ab-ca/schedule-tour";
var MAPS_URL = "https://maps.app.goo.gl/DSrZuGJ2nLEz2n616?g_st=ac";
function ParentLinks({ onBook, quiet }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: quiet ? "mt-2" : "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onBook,
			className: "w-full text-center text-sm font-semibold text-muted underline decoration-border underline-offset-4",
			children: "Book a free game-building session"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: MAPS_URL,
			target: "_blank",
			rel: "noreferrer",
			className: "mt-1 block text-center text-xs font-semibold text-muted underline decoration-border underline-offset-4",
			children: "Code Ninjas Central Edmonton"
		})]
	});
}
function BookCard({ onClose }) {
	const [parent, setParent] = (0, import_react.useState)("");
	const [contact, setContact] = (0, import_react.useState)("");
	const [kid, setKid] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	function submit(e) {
		e.preventDefault();
		const phone = contact.replace(/\D/g, "");
		const okContact = contact.includes("@") || phone.length >= 7;
		if (!parent.trim() || !kid.trim() || !when || !okContact) {
			setError("Add a parent name, a phone or email, the kid's first name, and a time.");
			return;
		}
		setError("");
		window.open(BOOK_URL, "_blank", "noopener,noreferrer");
		setSent(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-40 flex items-center justify-center bg-bg/80 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface p-5 shadow-2xl",
			children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-center font-display text-2xl font-extrabold tracking-wide text-fg",
					children: "The game is still here"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-center text-sm text-fg",
					children: [
						"Code Ninjas' booking page is open in another tab. Finish the time there for ",
						kid.trim(),
						". Hyper Strike is still right here."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: BOOK_URL,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-4 flex h-12 items-center justify-center rounded-2xl border-2 border-cyan text-sm font-extrabold text-fg",
					children: "Open the booking page"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: MAPS_URL,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-2 block text-center text-sm font-semibold text-muted underline decoration-border underline-offset-4",
					children: "Map for Central Edmonton"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "mt-3 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold text-fg",
					children: "Back to the game"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-center font-display text-2xl font-extrabold tracking-wide text-fg",
						children: "For a parent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-center text-sm text-muted",
						children: "Play stays open. This is not the price of another round."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-3 block text-xs font-bold tracking-wide text-muted",
						htmlFor: "parent-name",
						children: "Parent name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "parent-name",
						value: parent,
						autoComplete: "name",
						onChange: (e) => setParent(e.target.value),
						className: "mt-1 h-11 w-full rounded-2xl border border-border bg-bg px-3 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-2 block text-xs font-bold tracking-wide text-muted",
						htmlFor: "parent-contact",
						children: "Phone or email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "parent-contact",
						value: contact,
						autoComplete: "email",
						inputMode: "email",
						onChange: (e) => setContact(e.target.value),
						className: "mt-1 h-11 w-full rounded-2xl border border-border bg-bg px-3 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-2 block text-xs font-bold tracking-wide text-muted",
						htmlFor: "kid-name",
						children: "Kid's first name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "kid-name",
						value: kid,
						onChange: (e) => setKid(e.target.value),
						className: "mt-1 h-11 w-full rounded-2xl border border-border bg-bg px-3 text-sm text-fg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-2 block text-xs font-bold tracking-wide text-muted",
						htmlFor: "pref-time",
						children: "Preferred time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "pref-time",
						value: when,
						onChange: (e) => setWhen(e.target.value),
						className: "mt-1 h-11 w-full rounded-2xl border border-border bg-bg px-3 text-sm text-fg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Pick a time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "After school" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Weekday evening" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Saturday" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sunday" })
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-xs font-semibold text-magenta",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "mt-4 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-sm font-extrabold text-fg",
						children: "Continue to booking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: MAPS_URL,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-2 block text-center text-sm font-semibold text-muted underline decoration-border underline-offset-4",
						children: "Map for Central Edmonton"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "mt-2 h-11 w-full text-sm font-extrabold text-fg",
						children: "Not now"
					})
				]
			})
		})
	});
}
function paintRow(root, hp, shields) {
	if (!root) return;
	const prev = Number(root.dataset.hp ?? hp);
	root.dataset.hp = String(hp);
	root.querySelectorAll("[data-pip]").forEach((el, i) => {
		const on = i < hp;
		el.dataset.on = on ? "1" : "0";
		if (prev > hp && i >= hp && i < prev) el.animate([{ transform: "scale(1.45)" }, { transform: "scale(1)" }], { duration: 260 });
	});
	root.querySelectorAll("[data-gem]").forEach((el, i) => {
		el.dataset.on = i < shields ? "1" : "0";
	});
	const num = root.querySelector("[data-hp-num]");
	if (!num) return;
	num.textContent = String(hp);
	num.classList.toggle("is-crit", hp === 1);
	if (prev !== hp) num.animate([{ transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 220 });
}
function ChipRow({ earned }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 flex flex-wrap justify-center gap-1.5",
		children: Object.entries(CHIP_LABEL).map(([id, label]) => {
			const on = earned.includes(id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: `rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${on ? "border-amber bg-amber/15 text-amber" : "border-border text-muted"}`,
				children: label
			}, id);
		})
	});
}
function Pips({ rowRef }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rowRef,
		className: "flex min-w-0 flex-1 items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-0 flex-1 items-center gap-0.5",
				children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					"data-pip": true,
					"data-on": "1",
					className: "heart",
					viewBox: "0 0 24 24",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				"data-gem": true,
				className: "shield-mark",
				viewBox: "0 0 24 24",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2.1 20.4 5.2v6.4c0 4.7-3.3 7.8-7.9 9.8-.3.1-.7.1-1 0C6.9 19.4 3.6 16.3 3.6 11.6V5.2L12 2.1z" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				"data-gem": true,
				className: "shield-mark",
				viewBox: "0 0 24 24",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2.1 20.4 5.2v6.4c0 4.7-3.3 7.8-7.9 9.8-.3.1-.7.1-1 0C6.9 19.4 3.6 16.3 3.6 11.6V5.2L12 2.1z" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"data-hp-num": true,
				className: "w-7 text-right font-display text-2xl leading-none font-extrabold",
				children: "5"
			})
		]
	});
}
function HyperStrike() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const topRef = (0, import_react.useRef)(null);
	const botRef = (0, import_react.useRef)(null);
	const calloutRef = (0, import_react.useRef)(null);
	const comboRef = (0, import_react.useRef)(null);
	const [phase, setPhase] = (0, import_react.useState)("menu");
	const [labels, setLabels] = (0, import_react.useState)({
		top: "BOT",
		bottom: "YOU"
	});
	const [result, setResult] = (0, import_react.useState)(null);
	const [best, setBest] = (0, import_react.useState)(0);
	const [coach, setCoach] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(true);
	const [easy, setEasy] = (0, import_react.useState)(true);
	const [wins, setWins] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [ghost, setGhost] = (0, import_react.useState)(false);
	const [card, setCard] = (0, import_react.useState)(false);
	const [tip, setTip] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [tips, setTips] = (0, import_react.useState)(true);
	const [chips, setChips] = (0, import_react.useState)([]);
	const [mode, setMode] = (0, import_react.useState)("duel");
	const [meta, setMeta] = (0, import_react.useState)(null);
	const [live, setLive] = (0, import_react.useState)({
		score: 0,
		combo: 0,
		mul: 1
	});
	const [initials, setInitials] = (0, import_react.useState)("");
	const [boardSaved, setBoardSaved] = (0, import_react.useState)(false);
	const [rounds, setRounds] = (0, import_react.useState)(0);
	const [bookOpen, setBookOpen] = (0, import_react.useState)(false);
	const subRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
				el.animate([
					{
						opacity: 1,
						transform: "scale(1.12)"
					},
					{
						opacity: 1,
						transform: "scale(1)"
					},
					{
						opacity: 0,
						transform: "scale(0.96)"
					}
				], {
					duration: 900,
					easing: "cubic-bezier(.2,.8,.2,1)",
					fill: "forwards"
				});
				subEl?.animate([
					{ opacity: sub ? 1 : 0 },
					{ opacity: sub ? 1 : 0 },
					{ opacity: 0 }
				], {
					duration: 900,
					fill: "forwards"
				});
			},
			hud: (hud) => {
				paintRow(topRef.current, hud.p2hp, hud.p2shields);
				paintRow(botRef.current, hud.p1hp, hud.p1shields);
				const combo = comboRef.current;
				if (!combo) return;
				const show = hud.combo >= 2;
				const name = hud.combo >= 10 ? "LEGEND" : hud.combo >= 6 ? "BANANA" : hud.combo >= 3 ? "SWEET" : "";
				combo.textContent = show ? name ? `${hud.combo} ${name}` : `${hud.combo} HIT` : "";
				combo.style.opacity = show ? "1" : "0";
				combo.style.color = hud.hyper ? "var(--color-magenta)" : "var(--color-amber)";
				setLive({
					score: hud.score,
					combo: hud.combo,
					mul: hud.mul
				});
			},
			coach: (on) => setCoach(on),
			card: (on) => setCard(on),
			ghost: (on) => setGhost(on),
			tip: (text) => setTip(text),
			note: (text) => {
				setNote(text);
				window.setTimeout(() => {
					setNote((cur) => cur === text ? "" : cur);
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
			}
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
			}
		};
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
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
			if (savedMode === "survival" || savedMode === "speed" || savedMode === "chaos" || savedMode === "duel") setMode(savedMode);
			setMeta(loadMeta());
		} catch {}
		return () => {
			cancelAnimationFrame(raf);
			document.removeEventListener("visibilitychange", onVis);
			game.destroy();
			gameRef.current = null;
			delete window.__hyper;
		};
	}, []);
	function play(ai) {
		const game = gameRef.current;
		if (!game) return;
		game.unlock();
		game.start(ai);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh w-full justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-dvh w-full max-w-lg touch-none overflow-hidden bg-bg text-fg select-none",
			onPointerDown: () => gameRef.current?.unlock(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "absolute inset-0 h-full w-full touch-none",
					"aria-label": "Hyper Strike court"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] text-magenta",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-11 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-12 font-display text-xs tracking-widest",
							children: labels.top
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pips, { rowRef: topRef })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: calloutRef,
					className: "callout pointer-events-none absolute inset-x-0 top-[32%] z-10 text-center font-display text-3xl font-extrabold tracking-wide opacity-0 sm:text-5xl",
					"aria-live": "polite"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: subRef,
					className: "pointer-events-none absolute inset-x-0 top-[40%] z-10 text-center text-sm font-bold tracking-wide text-fg opacity-0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: comboRef,
					className: "pointer-events-none absolute inset-x-0 top-[46%] z-10 text-center font-display text-sm font-bold tracking-widest text-amber opacity-0"
				}),
				phase === "live" && coach && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pointer-events-none absolute inset-x-0 top-14 z-10 text-center text-sm font-semibold text-fg",
					children: "EDGE spikes · MIDDLE saves"
				}),
				phase === "live" && tip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pointer-events-none absolute inset-x-0 top-14 z-10 text-center text-sm font-semibold text-amber",
					children: tip
				}),
				phase === "live" && note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pointer-events-none absolute inset-x-4 top-24 z-10 mx-auto max-w-xs rounded-full border border-border bg-surface/90 px-3 py-2 text-center text-sm text-fg",
					children: note
				}),
				phase === "live" && card && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-x-4 top-20 z-10 mx-auto max-w-xs rounded-2xl border border-border bg-surface/95 px-4 py-3 text-center shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs font-extrabold tracking-widest text-amber",
							children: "RALLY 1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg font-extrabold text-fg",
							children: "EDGE · SPIKE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-extrabold text-cyan",
							children: "MIDDLE · SAVE"
						})
					]
				}),
				phase === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-x-6 bottom-16 z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-[11px] font-bold tracking-widest text-amber",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["RALLY ", live.combo] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							live.mul.toFixed(1),
							"x · ",
							live.score
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-amber transition-[width]",
							style: { width: `${Math.min(100, live.combo * 10)}%` }
						})
					})]
				}),
				phase === "live" && ghost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-24 z-10 flex items-center justify-center gap-10 text-cyan",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-10 ghost-arrow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold tracking-widest",
							children: "DRAG"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-10 ghost-arrow" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-cyan",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none w-10 font-display text-xs tracking-widest",
							children: labels.bottom
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none min-w-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pips, { rowRef: botRef })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": muted,
							"aria-label": muted ? "Turn sound on" : "Turn sound off",
							onClick: () => gameRef.current?.toggleMute(),
							className: "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-fg",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": shake,
							"aria-label": shake ? "Turn screen shake off" : "Turn screen shake on",
							onClick: () => gameRef.current?.toggleShake(),
							className: "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vibrate, { className: "size-4" })
						}),
						phase === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Pause",
							onClick: () => gameRef.current?.togglePause(),
							className: "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
						})
					]
				}),
				phase === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 pt-14 pb-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto max-h-[calc(100dvh-6rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface/95 p-5 shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-center font-display text-4xl font-extrabold tracking-wide text-cyan",
								children: "HYPER STRIKE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-center text-sm text-muted",
								children: "Five hearts. Then the paddle pops."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-4 gap-1",
								children: Object.keys(MODE_LABEL).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": mode === id,
									onClick: () => {
										setMode(id);
										gameRef.current?.setMode(id);
									},
									className: `h-9 rounded-xl border text-[11px] font-extrabold tracking-wide ${mode === id ? "border-amber bg-amber/15 text-fg" : "border-border text-muted"}`,
									children: MODE_LABEL[id]
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": easy,
									onClick: () => gameRef.current?.setEasy(true),
									className: `h-11 rounded-2xl border-2 text-sm font-extrabold tracking-wide ${easy ? "border-cyan bg-cyan/15 text-fg" : "border-border text-muted"}`,
									children: "Easy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": !easy,
									onClick: () => gameRef.current?.setEasy(false),
									className: `h-11 rounded-2xl border-2 text-sm font-extrabold tracking-wide ${easy ? "border-border text-muted" : "border-magenta bg-magenta/15 text-fg"}`,
									children: "Spicy"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => play(true),
								className: "mt-3 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-lg font-extrabold tracking-wide text-fg",
								children: "Play vs Bot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => play(false),
								className: "mt-2 h-12 w-full rounded-2xl border-2 border-magenta bg-magenta/15 text-lg font-extrabold tracking-wide text-fg",
								children: "2 Players"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-sm font-semibold text-fg",
								children: "You: drag the bottom, or A and D. Taunts: 1 2 3 4."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-sm font-semibold text-fg",
								children: "P2: drag the top, or J and L. Taunts: 7 8 9 0."
							}),
							meta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-center text-xs font-semibold text-amber",
								children: [
									"Today: ",
									meta.challenge.label,
									meta.challenge.done ? " · done" : ` · ${meta.challenge.progress}/${meta.challenge.goal}`
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center text-xs text-muted",
								children: easy ? "Easy is slower. The bot misses. Spicy stays honest." : "Spicy is full speed. Easy is the practice dojo."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, { earned: chips }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center text-sm font-semibold text-amber",
								children: best > 0 ? `Best streak ${best}` : "First win starts your streak."
							}),
							prizeLine(wins) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-center text-sm font-semibold text-cyan",
								children: prizeLine(wins)
							}),
							meta && meta.board.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-2 space-y-0.5 text-center text-xs text-muted",
								children: meta.board.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									i + 1,
									". ",
									row.name,
									" · ",
									row.score,
									" · ",
									MODE_LABEL[row.mode]
								] }, `${row.name}-${i}`))
							}),
							meta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap justify-center gap-1",
								children: [
									owned(1 + Math.floor(meta.xp / 250)).trails.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											gameRef.current?.setLook("trail", id);
											setMeta({
												...meta,
												trail: id
											});
										},
										className: `h-8 rounded-full border px-2 text-[10px] font-bold ${meta.trail === id ? "border-cyan text-cyan" : "border-border text-muted"}`,
										children: id
									}, `t-${id}`)),
									owned(1 + Math.floor(meta.xp / 250)).skins.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											gameRef.current?.setLook("skin", id);
											setMeta({
												...meta,
												skin: id
											});
										},
										className: `h-8 rounded-full border px-2 text-[10px] font-bold ${meta.skin === id ? "border-magenta text-magenta" : "border-border text-muted"}`,
										children: id
									}, `s-${id}`)),
									owned(1 + Math.floor(meta.xp / 250)).themes.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											gameRef.current?.setLook("theme", id);
											setMeta({
												...meta,
												theme: id
											});
										},
										className: `h-8 rounded-full border px-2 text-[10px] font-bold ${meta.theme === id ? "border-amber text-amber" : "border-border text-muted"}`,
										children: id
									}, `h-${id}`))
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-[10px] tracking-wide text-muted",
								children: "Created with Grok — Remix"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentLinks, {
								onBook: () => setBookOpen(true),
								quiet: true
							})
						]
					})
				}),
				phase === "end" && result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 pt-14 pb-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto max-h-full w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface/95 p-5 text-center shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: `font-display text-3xl font-extrabold tracking-wide ${result.youWin ? "text-cyan" : "text-magenta"}`,
								children: result.youWin ? "YOU WIN" : result.vsAI ? "SO CLOSE" : "P2 WINS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-fg",
								children: result.ko
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-2xl font-extrabold tracking-wide text-amber",
								children: result.score
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[11px] font-bold text-cyan",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["LV ", result.level] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"+",
											result.xpGain,
											" XP"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 h-2 overflow-hidden rounded-full bg-white/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-cyan",
											style: { width: `${Math.min(100, result.xpHave / result.xpNeed * 100)}%` }
										})
									}),
									result.unlocked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs font-semibold text-amber",
										children: ["Unlocked ", result.unlocked.join(", ")]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: [
									"Rally ",
									result.stats.rally,
									" · ",
									result.stats.speed,
									" speed · ",
									result.stats.hits,
									" hits · ",
									result.stats.efficiency,
									"% power-ups"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-3xl tracking-widest",
								"aria-label": `${result.stars} of 3 stars`,
								children: [
									0,
									1,
									2
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: i < result.stars ? "text-amber" : "text-muted",
									children: i < result.stars ? "★" : "☆"
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									result.winnerHp,
									" HP left · best rally ",
									result.rally,
									" · ",
									result.seconds,
									"s"
								]
							}),
							!result.vsAI && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg",
								children: "Local duel · rematch or swap seats"
							}),
							!result.vsAI && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm font-semibold text-amber",
								children: ["Best rally ", result.rally]
							}),
							result.vsAI && result.streak > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm font-semibold text-amber",
								children: ["Streak ", result.streak]
							}),
							result.nextTry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold text-cyan",
								children: result.nextTry
							}),
							result.prize && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold text-cyan",
								children: result.prize
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, { earned: result.chips }),
							result.needsInitials && !boardSaved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-3 flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									const name = (initials || "YOU").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3).padEnd(3, "A");
									const next = loadMeta();
									next.board = pushScore(next.board, {
										name,
										score: result.score,
										mode: result.mode
									});
									next.challenge = result.challenge;
									saveMeta(next);
									setMeta(next);
									setBoardSaved(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: initials,
									maxLength: 3,
									"aria-label": "Three initials",
									onChange: (e) => setInitials(e.target.value.toUpperCase()),
									className: "h-12 w-24 rounded-2xl border border-border bg-bg text-center font-display text-xl tracking-widest",
									placeholder: "AAA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "h-12 flex-1 rounded-2xl border-2 border-amber text-sm font-extrabold text-amber",
									children: "Save score"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => play(result.vsAI),
								className: "mt-4 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-base font-extrabold tracking-wide text-fg",
								children: "Rematch"
							}),
							rounds >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentLinks, {
								onBook: () => setBookOpen(true),
								quiet: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => gameRef.current?.toMenu(),
								className: "mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold tracking-wide text-fg",
								children: "Change mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => gameRef.current?.toMenu(),
								className: "mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold tracking-wide text-fg",
								children: "Done"
							})
						]
					})
				}),
				paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-30 flex items-center justify-center bg-bg/80 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-sm rounded-3xl border border-border bg-surface p-5 text-center shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-extrabold tracking-wide text-fg",
								children: "PAUSED"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => gameRef.current?.togglePause(),
								className: "mt-4 h-12 w-full rounded-2xl border-2 border-cyan bg-cyan/15 text-base font-extrabold text-fg",
								children: "Resume"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => play(gameRef.current?.versusAi ?? true),
								className: "mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold text-fg",
								children: "Rematch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => gameRef.current?.toMenu(),
								className: "mt-2 h-12 w-full rounded-2xl border-2 border-border text-base font-extrabold text-fg",
								children: "Menu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": muted,
										"aria-label": muted ? "Turn sound on" : "Turn sound off",
										onClick: () => gameRef.current?.toggleMute(),
										className: "inline-flex size-11 items-center justify-center rounded-full border border-border",
										children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": shake,
										"aria-label": shake ? "Turn screen shake off" : "Turn screen shake on",
										onClick: () => gameRef.current?.toggleShake(),
										className: "inline-flex size-11 items-center justify-center rounded-full border border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vibrate, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": tips,
										onClick: () => gameRef.current?.setTips(!tips),
										className: `h-11 rounded-full border px-3 text-xs font-extrabold tracking-wide ${tips ? "border-amber text-amber" : "border-border text-muted"}`,
										children: "Tips"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentLinks, { onBook: () => setBookOpen(true) })
						]
					})
				}),
				bookOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { onClose: () => setBookOpen(false) })
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HyperStrike, {});
}
//#endregion
export { Home as component };
