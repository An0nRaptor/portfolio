import { useEffect } from "react";

// Cursor parallax: sets --px / --py (-1..1, eased) on `ref`; children with
// the `depth` class and a --d value (px) shift by that much (see index.css).
// Mouse only, and off with reduced motion.
export default function useParallax(ref) {
    useEffect(() => {
        const el = ref.current;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return;
        let tx = 0;
        let ty = 0;
        let x = 0;
        let y = 0;
        let raf = 0;
        const step = () => {
            x += (tx - x) * 0.08;
            y += (ty - y) * 0.08;
            el.style.setProperty("--px", x.toFixed(3));
            el.style.setProperty("--py", y.toFixed(3));
            raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(step) : 0;
        };
        const onMove = e => {
            tx = (e.clientX / window.innerWidth) * 2 - 1;
            ty = (e.clientY / window.innerHeight) * 2 - 1;
            if (!raf) raf = requestAnimationFrame(step);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(raf);
        };
    }, [ref]);
}
