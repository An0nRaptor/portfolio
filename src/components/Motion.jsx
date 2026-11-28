import { useEffect, useRef, useState } from "react";

// Small motion pieces. Every one renders its final state first, so the
// pre-rendered HTML is complete and matches hydration; animation only starts
// in the browser, and never with prefers-reduced-motion.

function reducedMotion() {
    return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Calls `onView` once, when `ref` first scrolls into view. Elements already on
// screen at load are left alone (they're showing their final state).
function useFirstView(ref, onView) {
    const cb = useRef(onView);
    cb.current = onView;
    useEffect(() => {
        const el = ref.current;
        if (!el || reducedMotion() || !("IntersectionObserver" in window)) return;
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        const reset = cb.current("reset");
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                cb.current("start");
            },
            { rootMargin: "0px 0px -10% 0px" }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            if (typeof reset === "function") reset();
        };
    }, [ref]);
}

// A number that counts up from 0 (ease-out) when scrolled into view.
export function CountUp({ to, prefix = "", suffix = "", duration = 1400, delay = 150 }) {
    const ref = useRef(null);
    const raf = useRef(0);
    const [n, setN] = useState(to);
    useFirstView(ref, phase => {
        if (phase === "reset") {
            setN(0);
            return () => cancelAnimationFrame(raf.current);
        }
        const start = performance.now() + delay;
        const tick = now => {
            const p = Math.min(Math.max((now - start) / duration, 0), 1);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
    });
    return (
        <span ref={ref}>
            <span aria-hidden="true" className="tabular-nums">
                {prefix}
                {n}
                {suffix}
            </span>
            <span className="sr-only">
                {prefix}
                {to}
                {suffix}
            </span>
        </span>
    );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";

// Text that resolves letter by letter from random glyphs when scrolled into view.
export function DecodeText({ text, duration = 900, delay = 150 }) {
    const ref = useRef(null);
    const timer = useRef(0);
    const [shown, setShown] = useState(text);
    useFirstView(ref, phase => {
        const scramble = done =>
            text
                .split("")
                .map((ch, i) => (i < done ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
                .join("");
        if (phase === "reset") {
            setShown(scramble(0));
            return () => clearInterval(timer.current);
        }
        const start = performance.now() + delay;
        timer.current = setInterval(() => {
            const p = Math.min(Math.max((performance.now() - start) / duration, 0), 1);
            setShown(scramble(Math.floor(p * text.length)));
            if (p >= 1) clearInterval(timer.current);
        }, 45);
    });
    return (
        <span ref={ref}>
            <span aria-hidden="true">{shown}</span>
            <span className="sr-only">{text}</span>
        </span>
    );
}

// Types each word, holds it, deletes it, then moves to the next.
export function TypedWords({ words, typeMs = 70, deleteMs = 40, holdMs = 1700 }) {
    const [text, setText] = useState(words[0]);
    useEffect(() => {
        let i = 0;
        let len = words[0].length;
        let typing = false;
        let timeout;
        const reduce = reducedMotion();
        const step = () => {
            if (reduce) {
                i = (i + 1) % words.length;
                setText(words[i]);
                timeout = setTimeout(step, holdMs + 800);
                return;
            }
            if (!typing) {
                len -= 1;
                setText(words[i].slice(0, len));
                if (len > 0) {
                    timeout = setTimeout(step, deleteMs);
                    return;
                }
                i = (i + 1) % words.length;
                typing = true;
                timeout = setTimeout(step, 250);
                return;
            }
            len += 1;
            setText(words[i].slice(0, len));
            if (len < words[i].length) {
                timeout = setTimeout(step, typeMs);
                return;
            }
            typing = false;
            timeout = setTimeout(step, holdMs);
        };
        timeout = setTimeout(step, holdMs);
        return () => clearTimeout(timeout);
    }, [words, typeMs, deleteMs, holdMs]);
    return (
        <>
            <span aria-hidden="true">
                {text}
                <span className="caret" />
            </span>
            <span className="sr-only">{words.join(", ")}</span>
        </>
    );
}

// Card that tilts towards the mouse and shows a soft glow under the cursor.
// Mouse only: touch and reduced-motion users get the plain card.
export function TiltCard({ as: Tag = "article", max = 5, className = "", children }) {
    const ref = useRef(null);
    const frame = useRef(0);
    const onMove = e => {
        if (e.pointerType !== "mouse" || reducedMotion()) return;
        const el = ref.current;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            el.style.setProperty("--mx", `${x * 100}%`);
            el.style.setProperty("--my", `${y * 100}%`);
            el.style.transform = `perspective(1000px) rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max).toFixed(2)}deg)`;
        });
    };
    const onLeave = () => {
        cancelAnimationFrame(frame.current);
        if (ref.current) ref.current.style.transform = "";
    };
    return (
        <Tag ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt relative ${className}`}>
            <span aria-hidden="true" className="tilt-glow" />
            {children}
        </Tag>
    );
}

// Ink brush stroke under a heading, painted left to right (clip-path) when it
// scrolls into view. Already-visible strokes are left drawn.
export function BrushStroke({ className = "" }) {
    const ref = useRef(null);
    useFirstView(ref, phase => {
        const el = ref.current;
        if (phase === "reset") {
            el.classList.add("brush-wait");
            return () => el.classList.remove("brush-wait");
        }
        el.classList.remove("brush-wait");
    });
    return (
        <svg ref={ref} aria-hidden="true" viewBox="0 0 220 18" preserveAspectRatio="none" className={`brush ${className}`}>
            <path d="M3 10.5C30 6.5 80 5 140 5.6c35 .4 60 1.2 76 2.6 3 .4 3 3-.5 3.2-25.5 1.2-65.5 1-105.5 1.2-40 .2-75 1-104 2-4.5.2-5.5-3.6-3-4.1Z" />
            <path className="brush-dry" d="M20 15.6c50-.8 110-1.2 170-2l-1 1c-59 1-119 1.6-169 2Z" />
        </svg>
    );
}

// Paragraph whose words go from faint to full ink as it scrolls up the screen,
// with the newest few words in the accent colour (a wet-ink trail). The words
// start fully inked (pre-rendered HTML, reduced motion, and anything that is
// never scrolled to); only scrolling towards the paragraph fades them back.
export function InkText({ text, className = "" }) {
    const ref = useRef(null);
    const words = text.split(" ");
    useEffect(() => {
        const el = ref.current;
        if (!el || reducedMotion() || !("IntersectionObserver" in window)) return;
        const spans = [...el.querySelectorAll("[data-ink]")];
        const TRAIL = 4;
        let shown = -1;
        let raf = 0;
        const paint = () => {
            raf = 0;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            // 0 when the top reaches 85% of the screen, 1 when the bottom reaches 55%.
            const start = vh * 0.85;
            const p = Math.min(Math.max((start - r.top) / (start - vh * 0.55 + r.height), 0), 1);
            const k = p >= 1 ? spans.length + TRAIL : Math.round(p * spans.length);
            if (k === shown) return;
            shown = k;
            spans.forEach((s, i) => (s.dataset.ink = i < k - TRAIL ? "on" : i < k ? "wet" : "off"));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(paint);
        };
        // Only listen while the paragraph is on screen, and only fade it once
        // it is approached from below (not when already scrolled past).
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                paint();
                window.addEventListener("scroll", onScroll, { passive: true });
            } else {
                window.removeEventListener("scroll", onScroll);
            }
        });
        observer.observe(el);
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);
    return (
        <p ref={ref} className={className}>
            {words.map((w, i) => (
                // Words of a static string: index keys are fine here.
                <span key={i}>
                    <span data-ink="on" className="ink-word">
                        {w}
                    </span>
                    {i < words.length - 1 ? " " : ""}
                </span>
            ))}
        </p>
    );
}

// Four crop-mark corners around a card, drawn in when the card reveals.
export function CropMarks() {
    return (
        <>
            <span aria-hidden="true" className="crop crop-tl" />
            <span aria-hidden="true" className="crop crop-tr" />
            <span aria-hidden="true" className="crop crop-bl" />
            <span aria-hidden="true" className="crop crop-br" />
        </>
    );
}

// Hero code card: an object literal built from data.js, revealed line by line.
function Value({ value }) {
    if (Array.isArray(value)) {
        return (
            <>
                <span className="text-slate-500">[</span>
                {value.map((v, i) => (
                    <span key={v}>
                        <span className="text-amber-300">&quot;{v}&quot;</span>
                        {i < value.length - 1 && <span className="text-slate-500">, </span>}
                    </span>
                ))}
                <span className="text-slate-500">]</span>
            </>
        );
    }
    return <span className="text-amber-300">&quot;{value}&quot;</span>;
}

// The three files of the code card, each a list of lines.
function codeCardTabs({ file, fields, now, terminal }) {
    const ts = [
        <>
            <span className="text-fuchsia-400">const</span> <span className="text-sky-300">rahul</span>
            <span className="text-slate-500">: </span>
            <span className="text-emerald-300">Engineer</span> <span className="text-slate-500">=</span> <span className="text-slate-400">{"{"}</span>
        </>,
        ...fields.map(f => (
            <>
                {"  "}
                <span className="text-accent-300">{f.key}</span>
                <span className="text-slate-500">: </span>
                <Value value={f.value} />
                <span className="text-slate-500">,</span>
            </>
        )),
        <>
            <span className="text-slate-400">{"}"}</span>
            <span className="text-slate-500">;</span>
        </>,
        <>&nbsp;</>,
        <>
            <span className="text-fuchsia-400">export default</span> <span className="text-sky-300">rahul</span>
            <span className="text-slate-500">;</span>
            <span className="caret" />
        </>
    ];
    const md = [
        <>
            <span className="font-bold text-accent-300"># Now</span>
        </>,
        <>&nbsp;</>,
        ...now.map((item, i) => (
            <>
                <span className="text-fuchsia-400">- </span>
                {item}
                {i === now.length - 1 && <span className="caret" />}
            </>
        ))
    ];
    const prompt = <span className="text-emerald-400">~ $ </span>;
    const sh = [
        ...terminal.flatMap(t => [
            <>
                {prompt}
                <span className="text-slate-100">{t.cmd}</span>
            </>,
            <>
                <span className="text-slate-400">{t.out}</span>
            </>
        ]),
        <>
            {prompt}
            <span className="caret" />
        </>
    ];
    return [
        { name: file, badge: "TS", badgeClass: "bg-sky-500/15 text-sky-300", lines: ts, numbers: true },
        { name: "now.md", badge: "MD", badgeClass: "bg-amber-500/15 text-amber-300", lines: md, numbers: true },
        { name: "terminal", badge: "SH", badgeClass: "bg-emerald-500/15 text-emerald-300", lines: sh, numbers: false }
    ];
}

const TAB_MS = 6500;

// Hero code card: a mini editor with three tabs (rahul.ts, now.md, terminal),
// each revealed line by line. A progress bar moves to the next tab when it
// fills; it pauses on hover or off screen, stops for good once a tab is
// clicked, and never runs with reduced motion. The first tab renders first,
// so the pre-rendered HTML matches hydration.
export function CodeCard(props) {
    const tabs = codeCardTabs(props);
    const ref = useRef(null);
    const [tab, setTab] = useState(0);
    const [auto, setAuto] = useState(false);
    const [switched, setSwitched] = useState(false);
    const [hover, setHover] = useState(false);
    const [onScreen, setOnScreen] = useState(true);

    useEffect(() => {
        if (reducedMotion() || !("IntersectionObserver" in window)) return;
        setAuto(true);
        const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const show = i => {
        setTab(i);
        setSwitched(true);
    };
    const current = tabs[tab];

    return (
        <div ref={ref} className="float-slow" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <TiltCard as="figure" max={7} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b1e]/90 shadow-2xl shadow-accent-900/30 ring-1 ring-black/5">
                <figcaption className="relative flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                    <span className="h-3 w-3 flex-none rounded-full bg-[#ff5f57]/80" />
                    <span className="h-3 w-3 flex-none rounded-full bg-[#febc2e]/80" />
                    <span className="h-3 w-3 flex-none rounded-full bg-[#28c840]/80" />
                    <div role="tablist" aria-label="Files" className="ml-3 flex gap-1">
                        {tabs.map((t, i) => (
                            <button
                                key={t.name}
                                type="button"
                                role="tab"
                                id={`codecard-tab-${i}`}
                                aria-selected={tab === i}
                                aria-controls="codecard-panel"
                                onClick={() => {
                                    show(i);
                                    setAuto(false);
                                }}
                                className={`rounded-md px-2 py-1 font-mono text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${
                                    tab === i ? "bg-white/10 text-slate-100" : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                    <span className={`ml-auto rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${current.badgeClass}`}>{current.badge}</span>
                    {auto && (
                        <span
                            key={tab}
                            aria-hidden="true"
                            className="codecard-progress"
                            style={{ animationDuration: `${TAB_MS}ms`, animationPlayState: hover || !onScreen ? "paused" : "running" }}
                            onAnimationEnd={() => show((tab + 1) % tabs.length)}
                        />
                    )}
                </figcaption>
                <pre id="codecard-panel" role="tabpanel" aria-labelledby={`codecard-tab-${tab}`} className="min-h-[292px] overflow-x-auto px-5 py-5 font-mono text-[13px] leading-7 text-slate-300">
                    {/* Re-keyed per tab so the lines animate in again. */}
                    <code key={tab}>
                        {current.lines.map((line, i) => (
                            // Static list: index keys are fine here.
                            <span key={i} className="code-line flex" style={{ animationDelay: `${switched ? 60 + i * 70 : 300 + i * 110}ms` }}>
                                {current.numbers && (
                                    <span aria-hidden="true" className="mr-5 w-4 flex-none select-none text-right text-slate-600">
                                        {i + 1}
                                    </span>
                                )}
                                <span className="whitespace-pre">{line}</span>
                            </span>
                        ))}
                    </code>
                </pre>
            </TiltCard>
        </div>
    );
}
