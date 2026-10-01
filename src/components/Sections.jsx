import { ArrowRight, ArrowUpRight, Download, MapPin, Mail } from "lucide-react";
import { profile, experience, skills, projects, credentials } from "../data.js";
import { GitHubIcon, LinkedInIcon } from "./Icons.jsx";

function SectionHeader({ eyebrow, title, children }) {
    return (
        <div className="reveal max-w-2xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="section-title">{title}</h2>
            {children && <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{children}</p>}
        </div>
    );
}

export function Hero() {
    return (
        <section id="top" className="relative overflow-hidden">
            {/* soft background: grid + accent glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(148_163_184/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.12)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-500/10"
            />

            <div className="relative mx-auto grid max-w-content items-center gap-14 px-5 pb-20 pt-32 sm:px-8 md:grid-cols-[1.4fr_1fr] md:pb-28 md:pt-40">
                <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                        {profile.role} · <MapPin size={12} className="-mr-1" /> {profile.location}
                    </p>
                    <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                        Hi, I’m {profile.name}.
                        <span className="mt-3 block text-2xl font-bold leading-snug sm:text-3xl lg:text-[2.1rem] bg-gradient-to-r from-accent-600 to-sky-600 bg-clip-text text-transparent dark:from-accent-300 dark:to-sky-400">
                            {profile.headline}
                        </span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                        {profile.intro}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <a href="#projects" className="btn-primary">
                            View my work <ArrowRight size={16} />
                        </a>
                        <a href="#contact" className="btn-ghost">
                            Get in touch
                        </a>
                        <span className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-white/10 sm:block" />
                        <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
                            <GitHubIcon className="h-5 w-5" />
                        </a>
                        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
                            <LinkedInIcon className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <div className="relative mx-auto w-64 sm:w-72 md:w-full md:max-w-sm">
                    <div aria-hidden="true" className="absolute -inset-3 rotate-3 rounded-[2rem] bg-gradient-to-br from-accent-400 to-sky-500 opacity-80" />
                    <img
                        src={profile.photo}
                        alt={`Portrait of ${profile.name}`}
                        width="800"
                        height="800"
                        className="relative aspect-square w-full rounded-[1.75rem] object-cover shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
}

export function About() {
    return (
        <section id="about" className="section">
            <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
                <SectionHeader eyebrow="About" title="Frontend engineer who cares about the details." />
                <div className="reveal space-y-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {profile.about.map(p => (
                        <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                </div>
            </div>
            <dl className="reveal mt-14 grid gap-4 sm:grid-cols-3">
                {profile.stats.map(s => (
                    <div key={s.label} className="card p-6">
                        <dt className="text-sm text-slate-500 dark:text-slate-400">{s.label}</dt>
                        <dd className="mt-2 font-display text-4xl font-extrabold text-slate-900 dark:text-white">{s.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

export function Experience() {
    return (
        <section id="experience" className="border-y border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-white/[0.015]">
            <div className="section">
                <SectionHeader eyebrow="Experience" title="Where I’ve worked" />
                <ol className="mt-12 space-y-6">
                    {experience.map(job => (
                        <li key={job.company} className="reveal card grid gap-6 p-6 sm:p-8 md:grid-cols-[220px_1fr]">
                            <div>
                                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{job.period}</p>
                                <h3 className="mt-2 text-xl font-bold">{job.company}</h3>
                                <p className="text-sm font-medium text-accent-700 dark:text-accent-400">{job.role}</p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{job.context}</p>
                            </div>
                            <div>
                                <ul className="space-y-3">
                                    {job.points.map(point => (
                                        <li key={point.slice(0, 32)} className="flex gap-3 text-[15px] leading-relaxed">
                                            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {job.stack.map(t => (
                                        <span key={t} className="tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export function Skills() {
    return (
        <section id="skills" className="section">
            <SectionHeader eyebrow="Skills" title="Tools I use to ship">
                Strongest in React and modern JavaScript, with enough backend and DevOps to take a feature end to end.
            </SectionHeader>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((group, i) => (
                    <div key={group.group} className={`reveal card p-6 ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{group.group}</h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {group.items.map(item => (
                                <li key={item} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800 dark:border-white/10 dark:text-slate-200">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

function SnippetVaultArt() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-200 via-sky-100 to-pink-100 p-6 dark:from-violet-900/50 dark:via-slate-900 dark:to-sky-900/40">
            <div className="w-full max-w-xs overflow-hidden rounded-xl bg-[#14121f] shadow-xl">
                <div className="flex items-center gap-1.5 bg-[#1c1930] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-2 font-mono text-[10px] text-white/40">import-map.txt</span>
                </div>
                <pre className="px-3 py-3 font-mono text-[10.5px] leading-relaxed text-[#e9e7f3]">
                    <span className="text-violet-300">window</span>.importMapOverrides{"\n"}
                    {"  "}.<span className="text-sky-300">enableUI</span>(){"\n"}
                    <span className="text-white/35">{"// synced via Google Drive ✓"}</span>
                </pre>
            </div>
        </div>
    );
}

export function Projects() {
    return (
        <section id="projects" className="border-t border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-white/[0.015]">
            <div className="section">
                <SectionHeader eyebrow="Projects" title="Things I’ve built">
                    Side projects where I own everything, from the data model to deployment.
                </SectionHeader>
                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {projects.map(project => (
                        <article key={project.title} className="reveal card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                            <div className="aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={`${project.title} screenshot`}
                                        loading="lazy"
                                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <SnippetVaultArt />
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="text-lg font-bold">{project.title}</h3>
                                    <span className="font-mono text-xs text-slate-400">{project.year}</span>
                                </div>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {project.stack.map(t => (
                                        <span key={t} className="tag">{t}</span>
                                    ))}
                                </div>
                                <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm font-semibold dark:border-white/5">
                                    {project.links.live && (
                                        <a href={project.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-900 hover:text-accent-600 dark:text-white dark:hover:text-accent-400">
                                            Live demo <ArrowUpRight size={15} />
                                        </a>
                                    )}
                                    {project.links.github && (
                                        <a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                                            <GitHubIcon className="h-4 w-4" /> Code
                                        </a>
                                    )}
                                    {!project.links.live && !project.links.github && (
                                        <span className="text-xs font-medium text-slate-400">Personal tool, in daily use</span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Credentials() {
    return (
        <section className="section !pb-10">
            <SectionHeader eyebrow="Credentials" title="Education & certifications" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {credentials.map(c => {
                    const body = (
                        <>
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-base font-semibold">{c.title}</h3>
                                {c.year && <span className="font-mono text-xs text-slate-400">{c.year}</span>}
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.detail}</p>
                        </>
                    );
                    return (
                        <li key={c.title} className="reveal">
                            {c.href ? (
                                <a href={c.href} target="_blank" rel="noreferrer" className="card block h-full p-5 transition hover:border-accent-400">
                                    {body}
                                </a>
                            ) : (
                                <div className="card h-full p-5">{body}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-white/5">
            <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:px-8">
                <p>© {new Date().getFullYear()} {profile.name}. Built with React &amp; Tailwind CSS.</p>
                <div className="flex items-center gap-4">
                    <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-slate-900 dark:hover:text-white"><Mail size={18} /></a>
                    <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-slate-900 dark:hover:text-white"><GitHubIcon className="h-[18px] w-[18px]" /></a>
                    <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-slate-900 dark:hover:text-white"><LinkedInIcon className="h-[18px] w-[18px]" /></a>
                    <a href={profile.resume} download className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"><Download size={16} /> Résumé</a>
                </div>
            </div>
        </footer>
    );
}
