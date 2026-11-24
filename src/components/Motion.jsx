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

export function CodeCard({ file, fields }) {
    const lines = [
        <>
            <span className="text-fuchsia-400">const</span> <span className="text-sky-300">rahul</span> <span className="text-slate-500">=</span> <span className="text-slate-400">{"{"}</span>
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
    return (
        <div className="float-slow">
            <TiltCard as="figure" max={7} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b1e]/90 shadow-2xl shadow-accent-900/30 ring-1 ring-black/5">
                <figcaption className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
                    <span className="ml-3 font-mono text-xs text-slate-400">{file}</span>
                    <span className="ml-auto rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-300">TS</span>
                </figcaption>
                <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-7 text-slate-300">
                    <code>
                        {lines.map((line, i) => (
                            // Static list: index keys are fine here.
                             
                            <span key={i} className="code-line flex" style={{ animationDelay: `${300 + i * 110}ms` }}>
                                <span aria-hidden="true" className="mr-5 w-4 select-none text-right text-slate-600">
                                    {i + 1}
                                </span>
                                <span className="whitespace-pre">{line}</span>
                            </span>
                        ))}
                    </code>
                </pre>
            </TiltCard>
        </div>
    );
}
