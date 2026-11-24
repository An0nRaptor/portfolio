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

        // Items that enter together (a row of cards) arrive one after another.
        // The delay is cleared afterwards so it never slows hover transitions.
        const observer = new IntersectionObserver(
            entries => {
                entries
                    .filter(entry => entry.isIntersecting)
                    .forEach((entry, i) => {
                        const el = entry.target;
                        el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
                        el.classList.add("is-visible");
                        el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
                        observer.unobserve(el);
                    });
            },
            { rootMargin: "0px 0px -8% 0px" }
        );
        items.filter(el => !el.classList.contains("is-visible")).forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
