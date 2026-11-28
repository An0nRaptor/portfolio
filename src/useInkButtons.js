import { useEffect } from "react";

// Ink fill on .btn-primary: the fill (a ::before circle, see index.css) grows
// from the point where the cursor enters and shrinks back toward the point
// where it leaves. One delegated listener covers every button on the page.
export default function useInkButtons() {
    useEffect(() => {
        const place = e => {
            if (e.pointerType !== "mouse") return;
            const btn = e.target.closest?.(".btn-primary");
            if (!btn) return;
            const r = btn.getBoundingClientRect();
            btn.style.setProperty("--ink-x", `${e.clientX - r.left}px`);
            btn.style.setProperty("--ink-y", `${e.clientY - r.top}px`);
        };
        document.addEventListener("pointerover", place, { passive: true });
        document.addEventListener("pointerout", place, { passive: true });
        return () => {
            document.removeEventListener("pointerover", place);
            document.removeEventListener("pointerout", place);
        };
    }, []);
}
