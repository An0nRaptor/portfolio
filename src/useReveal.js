import { useEffect } from "react";

// Fades `.reveal` elements in as they scroll into view. The page is
// pre-rendered, so everything is visible before JS; anything already on
// screen is marked visible *before* the `js` class switches the hidden state
// on, so nothing above the fold flickers.
export default function useReveal() {
    useEffect(() => {
        const items = [...document.querySelectorAll(".reveal")];
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || !("IntersectionObserver" in window)) {
            items.forEach(el => el.classList.add("is-visible"));
            return;
        }
        const vh = window.innerHeight;
        items.forEach(el => {
            if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
        });
        document.documentElement.classList.add("js");

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px" }
        );
        items.filter(el => !el.classList.contains("is-visible")).forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
