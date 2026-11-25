import { Fragment, useEffect, useRef } from "react";

// Page-wide animated background, fixed behind everything. Built so the GPU
// does almost all the work and nothing repaints on scroll:
// 1. Dot grid: plain CSS, painted once on its own layer.
// 2. Cursor: a soft spotlight (CSS layer moved with transform) and a small
//    canvas, only as big as the cursor's reach, that lights up nearby dots.
//    The draw loop sleeps as soon as the cursor settles.
// 3. Twinkles: a few dots fade in and out with the Web Animations API
//    (opacity only, runs on the compositor, no JS per frame).
// 4. Ambient glows whose colour follows the section in view: corner blobs per
//    tone, crossfaded with opacity. Blob-sized, not full-screen, so a weak
//    integrated GPU isn't blending several screen-sized layers every frame.
// Reduced motion: static dots and glows only.

const GAP = 24; // must match background-size of .bg-dots
const RADIUS = 170; // cursor reach, px
const SIZE = Math.ceil((RADIUS * 2) / GAP + 2) * GAP; // canvas side, grid-aligned
const TWINKLES = 6;
const TONES = {
    top: [31, 163, 163],
    experience: [14, 165, 233],
    projects: [99, 102, 241],
    contact: [16, 185, 129]
};
const TONE_NAMES = Object.keys(TONES);

// Sections without a tone of their own keep the tone of the one before them.
function sectionTones() {
    let current = "top";
    return [...document.querySelectorAll("section")].map(el => {
        if (TONES[el.id]) current = el.id;
        return { el, tone: current };
    });
}

export default function Background() {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const spotRef = useRef(null);
    const twinkleRefs = useRef([]);

    // Scroll tone: mark the root with the tone of the section in view.
    useEffect(() => {
        const root = rootRef.current;
        const items = sectionTones();
        const visible = new Set();
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(e => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
                const first = items.find(i => visible.has(i.el));
                if (first) root.dataset.tone = first.tone;
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );
        items.forEach(i => observer.observe(i.el));
        return () => observer.disconnect();
    }, []);

    // Twinkles.
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let next = 0;
        const timer = setInterval(() => {
            if (document.hidden) return;
            const el = twinkleRefs.current[next];
            next = (next + 1) % TWINKLES;
            if (!el) return;
            const x = Math.floor(Math.random() * (window.innerWidth / GAP)) * GAP;
            const y = Math.floor(Math.random() * (window.innerHeight / GAP)) * GAP;
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1600 + Math.random() * 1400, easing: "ease-in-out" });
        }, 650);
        return () => clearInterval(timer);
    }, []);

    // Cursor spotlight + lit dots (mouse only).
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const spot = spotRef.current;
        const ctx = canvas.getContext("2d");

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = SIZE * dpr;
        canvas.height = SIZE * dpr;
        ctx.scale(dpr, dpr);

        let raf = 0;
        let last = 0;
        let running = false;
        let dark = document.documentElement.classList.contains("dark");
        const target = { x: 0, y: 0, on: 0 };
        const pos = { x: 0, y: 0, on: 0 };
        const color = [...TONES.top];

        const draw = now => {
            const dt = Math.min(now - (last || now - 16.67), 64);
            last = now;
            // Frame-rate independent easing: same feel at 60, 120 or 144 Hz.
            const k = 1 - Math.pow(1 - 0.18, dt / 16.67);
            pos.x += (target.x - pos.x) * k;
            pos.y += (target.y - pos.y) * k;
            pos.on += (target.on - pos.on) * k;
            const goal = TONES[root.dataset.tone] || TONES.top;
            for (let i = 0; i < 3; i++) color[i] += (goal[i] - color[i]) * k * 0.5;

            // Spotlight: compositor-only move + fade.
            spot.style.transform = `translate3d(${pos.x - 300}px, ${pos.y - 300}px, 0)`;
            spot.style.opacity = pos.on.toFixed(3);

            // Canvas snapped to the grid so its dots sit exactly on the CSS dots.
            const ox = Math.floor((pos.x - SIZE / 2) / GAP) * GAP;
            const oy = Math.floor((pos.y - SIZE / 2) / GAP) * GAP;
            canvas.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
            ctx.clearRect(0, 0, SIZE, SIZE);
            ctx.fillStyle = `rgb(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])})`;
            const peak = (dark ? 0.95 : 0.85) * pos.on;
            for (let gx = 0; gx < SIZE; gx += GAP) {
                const cx = gx + GAP / 2;
                for (let gy = 0; gy < SIZE; gy += GAP) {
                    const cy = gy + GAP / 2;
                    const d = Math.hypot(ox + cx - pos.x, oy + cy - pos.y);
                    if (d >= RADIUS) continue;
                    const t = 1 - d / RADIUS;
                    const s = t * t;
                    ctx.globalAlpha = s * peak;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 1 + s * 1.6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            const settled =
                Math.abs(target.x - pos.x) < 0.2 &&
                Math.abs(target.y - pos.y) < 0.2 &&
                Math.abs(target.on - pos.on) < 0.004 &&
                goal.every((v, i) => Math.abs(v - color[i]) < 0.5);
            if (settled) {
                running = false;
                last = 0;
                return;
            }
            raf = requestAnimationFrame(draw);
        };

        const wake = () => {
            if (running || document.hidden) return;
            running = true;
            raf = requestAnimationFrame(draw);
        };

        const onMove = e => {
            if (e.pointerType !== "mouse") return;
            if (target.on === 0 && pos.on < 0.05) {
                // Entering: start at the pointer instead of sweeping in.
                pos.x = e.clientX;
                pos.y = e.clientY;
            }
            target.x = e.clientX;
            target.y = e.clientY;
            target.on = 1;
            wake();
        };
        const onLeave = () => {
            target.on = 0;
            wake();
        };

        // Theme and tone changes need one redraw.
        const observer = new MutationObserver(() => {
            dark = document.documentElement.classList.contains("dark");
            wake();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        observer.observe(root, { attributes: true, attributeFilter: ["data-tone"] });

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <div ref={rootRef} aria-hidden="true" className="bg-root" data-tone="top">
            {/* Two corner blobs per tone, each only as big as its gradient. */}
            {TONE_NAMES.map(name => (
                <Fragment key={name}>
                    <span className={`bg-glow bg-glow-a bg-glow-${name}`} />
                    <span className={`bg-glow bg-glow-b bg-glow-${name}`} />
                </Fragment>
            ))}
            <div className="bg-dots" />
            {Array.from({ length: TWINKLES }, (_, i) => (
                <span key={i} ref={el => (twinkleRefs.current[i] = el)} className="bg-twinkle" />
            ))}
            <span ref={spotRef} className="bg-spot" />
            <canvas ref={canvasRef} className="bg-canvas" style={{ width: SIZE, height: SIZE }} />
        </div>
    );
}
