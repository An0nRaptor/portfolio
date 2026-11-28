import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Inertial smooth scrolling (Lenis) for mouse and trackpad users. Touch
// devices keep native scrolling, and it stays off with reduced motion.
// In-page #links also go through Lenis; it honours the html scroll-padding-top
// (index.css), so no extra offset is needed for the fixed header.
// The instance is exposed as window.__lenis for code that scrolls itself
// (the command palette).
export default function useSmoothScroll() {
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
        const lenis = new Lenis({
            autoRaf: true,
            lerp: 0.1,
            anchors: true,
            // Let dialogs (command palette list) scroll natively.
            prevent: node => !!node.closest?.("[role=dialog]")
        });
        window.__lenis = lenis;
        return () => {
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);
}
