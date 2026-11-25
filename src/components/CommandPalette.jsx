import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Compass, Copy, CornerDownLeft, FileDown, Mail, Moon, Rocket, Search, Sun } from "lucide-react";
import { profile, projects } from "../data.js";
import { GitHubIcon, LinkedInIcon } from "./Icons.jsx";

// Ctrl/⌘+K command palette: jump to a section, open links, copy the email or
// switch theme from the keyboard. Rendered by Navbar, which owns the theme.
// Closed on first render, so the pre-rendered HTML matches on hydration.

function buildCommands({ links, dark, toggleTheme }) {
    const go = href => () => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    const open = url => () => window.open(url, "_blank", "noreferrer");
    const featured = projects.find(p => p.links.live);
    return [
        ...[{ href: "#top", label: "Home" }, ...links].map(l => ({ id: `go${l.href}`, group: "Navigate", label: l.label, icon: Compass, run: go(l.href) })),
        { id: "copy-email", group: "Actions", label: "Copy email address", hint: profile.email, icon: Copy, keep: true, run: () => navigator.clipboard?.writeText(profile.email) },
        { id: "email", group: "Actions", label: "Send an email", icon: Mail, run: () => (window.location.href = `mailto:${profile.email}`) },
        { id: "resume", group: "Actions", label: "Download résumé", hint: "PDF", icon: FileDown, run: () => document.getElementById("cmdk-resume")?.click() },
        { id: "theme", group: "Actions", label: dark ? "Switch to light theme" : "Switch to dark theme", icon: dark ? Sun : Moon, run: toggleTheme },
        featured && { id: "demo", group: "Links", label: `Open ${featured.title} live demo`, icon: Rocket, external: true, run: open(featured.links.live) },
        { id: "github", group: "Links", label: "GitHub", hint: "An0nRaptor", icon: GitHubIcon, external: true, run: open(profile.links.github) },
        { id: "linkedin", group: "Links", label: "LinkedIn", icon: LinkedInIcon, external: true, run: open(profile.links.linkedin) }
    ].filter(Boolean);
}

export default function CommandPalette({ open, onClose, links, dark, toggleTheme }) {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const returnFocus = useRef(null);

    const commands = useMemo(() => buildCommands({ links, dark, toggleTheme }), [links, dark, toggleTheme]);
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return commands;
        return commands.filter(c => `${c.label} ${c.group} ${c.hint || ""}`.toLowerCase().includes(q));
    }, [commands, query]);

    // Reset on open, remember and restore focus, lock page scroll.
    useEffect(() => {
        if (!open) return;
        returnFocus.current = document.activeElement;
        setQuery("");
        setActive(0);
        setCopied(false);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        requestAnimationFrame(() => inputRef.current?.focus());
        return () => {
            document.body.style.overflow = overflow;
            returnFocus.current?.focus?.();
        };
    }, [open]);

    useEffect(() => setActive(0), [query]);

    // Keep the highlighted row visible while arrowing through the list.
    useEffect(() => {
        listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }, [active]);

    if (!open) return null;

    const run = cmd => {
        if (!cmd) return;
        cmd.run();
        if (cmd.keep) {
            setCopied(true);
            setTimeout(onClose, 700);
            return;
        }
        onClose();
    };

    const onKeyDown = e => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive(i => (results.length ? (i + 1) % results.length : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(i => (results.length ? (i - 1 + results.length) % results.length : 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            run(results[active]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
        } else if (e.key === "Tab") {
            // Only the input is focusable inside the dialog; keep focus there.
            e.preventDefault();
        }
    };

    let lastGroup = "";
    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]" onKeyDown={onKeyDown}>
            <div aria-hidden="true" className="cmdk-backdrop absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60" onClick={onClose} />
            <div role="dialog" aria-modal="true" aria-label="Command palette" className="cmdk-panel relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-accent-900/20 dark:border-white/10 dark:bg-[#0d1b1e]">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent" />
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-white/10">
                    <Search size={18} aria-hidden="true" className="flex-none text-slate-400" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type a command or search…"
                        className="h-14 w-full bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="cmdk-list"
                        aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined}
                        aria-autocomplete="list"
                        spellCheck="false"
                    />
                    <kbd className="kbd hidden flex-none sm:inline-flex">Esc</kbd>
                </div>

                <ul id="cmdk-list" ref={listRef} role="listbox" aria-label="Commands" className="max-h-[min(380px,55vh)] overflow-y-auto p-2">
                    {results.length === 0 && <li className="px-3 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No results for “{query}”</li>}
                    {results.map((cmd, i) => {
                        const showGroup = cmd.group !== lastGroup;
                        lastGroup = cmd.group;
                        const Icon = cmd.id === "copy-email" && copied ? Check : cmd.icon;
                        const selected = i === active;
                        return (
                            <li key={cmd.id} role="presentation">
                                {showGroup && <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 first:pt-1">{cmd.group}</p>}
                                <div
                                    id={`cmdk-${cmd.id}`}
                                    role="option"
                                    aria-selected={selected}
                                    data-index={i}
                                    onMouseMove={() => !selected && setActive(i)}
                                    onClick={() => run(cmd)}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                        selected ? "bg-accent-50 text-slate-900 dark:bg-accent-500/10 dark:text-white" : "text-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ring-1 transition-colors ${
                                            selected ? "bg-white text-accent-700 ring-accent-300 dark:bg-accent-500/15 dark:text-accent-300 dark:ring-accent-500/40" : "bg-slate-50 text-slate-500 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <span className="flex-1 font-medium">{cmd.id === "copy-email" && copied ? "Copied!" : cmd.label}</span>
                                    {cmd.hint && <span className="hidden font-mono text-xs text-slate-400 sm:inline">{cmd.hint}</span>}
                                    {cmd.external && <ArrowUpRight size={15} aria-hidden="true" className="text-slate-400" />}
                                    {selected && <CornerDownLeft size={14} aria-hidden="true" className="text-accent-600 dark:text-accent-400" />}
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className="hidden items-center justify-between gap-3 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-white/10 sm:flex dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <kbd className="kbd">↑</kbd>
                        <kbd className="kbd">↓</kbd> to move
                        <kbd className="kbd ml-2">↵</kbd> to select
                    </span>
                    <span className="font-mono">rahul<span className="text-accent-500">.</span>yadav</span>
                </div>
                {/* Hidden anchor so "Download résumé" uses the browser's normal download. */}
                <a id="cmdk-resume" href={profile.resume} download hidden tabIndex={-1} />
            </div>
        </div>
    );
}
