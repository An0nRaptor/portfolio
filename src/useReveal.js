import { useEffect } from "react";

// Fades `.reveal` elements in as they scroll into view. The `js` class gates
// the hidden state in CSS, so content is never invisible if this doesn't run.
export default function useReveal() {
    useEffect(() => {
        document.documentElement.classList.add("js");
        const items = document.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) {
            items.forEach(el => el.classList.add("is-visible"));
            return;
        }
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -10% 0px" }
        );
        items.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
