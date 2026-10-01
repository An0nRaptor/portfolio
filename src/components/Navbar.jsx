import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { profile } from "../data.js";

const LINKS = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" }
];

function useTheme() {
    const [dark, setDark] = useState(() =>
        document.documentElement.classList.contains("dark")
    );
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
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) setActive(`#${e.target.id}`);
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition ${
                scrolled || open
                    ? "border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-[#0b1416]/80"
                    : "border-b border-transparent"
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
                <a href="#top" className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    rahul<span className="text-accent-600 dark:text-accent-400">.</span>yadav
                </a>

                <ul className="hidden items-center gap-1 md:flex">
                    {LINKS.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                                    active === link.href
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                    >
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <a href={profile.resume} className="btn-primary hidden !px-4 !py-2 sm:inline-flex" download>
                        Résumé
                    </a>
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 md:hidden"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {open && (
                <ul className="border-t border-slate-200 px-5 pb-4 pt-2 dark:border-white/10 md:hidden">
                    {LINKS.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li className="mt-2 px-3">
                        <a href={profile.resume} className="btn-primary w-full" download>
                            Download résumé
                        </a>
                    </li>
                </ul>
            )}
        </header>
    );
}
