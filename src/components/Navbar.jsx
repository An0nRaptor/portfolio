import { useEffect, useRef, useState } from "react";
import { Menu, X, Moon, Sun, Download } from "lucide-react";
import { profile } from "../data.js";

const LINKS = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" }
];

// The theme class is applied by an inline script in index.html before first
// paint. State starts neutral so the pre-rendered HTML matches on hydration,
// then syncs with the real class.
function useTheme() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        setDark(document.documentElement.classList.contains("dark"));
    }, []);
    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            /* private mode: theme just won't persist */
        }
    };
    return [dark, toggle];
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("");
    const [dark, toggleTheme] = useTheme();
    const headerRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Highlight the section currently in view.
    useEffect(() => {
        const sections = LINKS.map(l => document.querySelector(l.href)).filter(Boolean);
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => e.isIntersecting && setActive(`#${e.target.id}`)),
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Mobile menu: close on Escape, outside tap, or when widening to desktop.
    useEffect(() => {
        if (!open) return;
        const onKey = e => e.key === "Escape" && setOpen(false);
        const onDown = e => !headerRef.current?.contains(e.target) && setOpen(false);
        const mq = window.matchMedia("(min-width: 768px)");
        const onMq = e => e.matches && setOpen(false);
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onDown);
        mq.addEventListener("change", onMq);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onDown);
            mq.removeEventListener("change", onMq);
        };
    }, [open]);

    return (
        <header
            ref={headerRef}
            className={`fixed inset-x-0 top-0 z-50 transition-colors ${
                open
                    ? "border-b border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0b1416]"
                    : scrolled
                      ? "border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0b1416]/90"
                      : "border-b border-transparent"
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8" aria-label="Main">
                <a href="#top" className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    rahul<span className="text-accent-600 dark:text-accent-400">.</span>yadav
                </a>

                <ul className="hidden items-center gap-1 md:flex">
                    {LINKS.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                aria-current={active === link.href ? "true" : undefined}
                                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition ${
                                    active === link.href
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                            >
                                {link.label}
                                {active === link.href && <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent-500" />}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                    >
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <a href={profile.resume} className="btn-primary hidden !px-4 !py-2 sm:inline-flex" download>
                        Résumé
                    </a>
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="rounded-full p-2.5 text-slate-700 hover:bg-slate-100 md:hidden dark:text-slate-200 dark:hover:bg-white/10"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {open && (
                <div id="mobile-menu" className="border-t border-slate-200 px-5 pb-5 pt-2 md:hidden dark:border-white/10">
                    <ul>
                        {LINKS.map(link => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a href={profile.resume} className="btn-primary mt-3 w-full" download>
                        <Download size={16} /> Download résumé
                    </a>
                </div>
            )}
        </header>
    );
}
