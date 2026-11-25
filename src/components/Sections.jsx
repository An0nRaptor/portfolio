import { ArrowRight, ArrowUpRight, ArrowUp, Boxes, BriefcaseBusiness, Check, Cloud, Container, Download, Gauge, Layers, MapPin, Mail, Sparkles } from "lucide-react";
import { profile, experience, skills, projects, credentials, learning } from "../data.js";
import { GitHubIcon, LinkedInIcon, SkillIcon } from "./Icons.jsx";
import { CodeCard, CountUp, DecodeText, TiltCard, TypedWords } from "./Motion.jsx";

// Icon keys used in data.js.
const STAT_ICONS = { experience: BriefcaseBusiness, speed: Gauge, architecture: Boxes };
const LEARNING_ICONS = { next: Layers, docker: Container, aws: Cloud, ai: Sparkles };

// Responsive WebP from /public/img/<name>-<width>.webp. `eager` is for
// above-the-fold images (load first, high priority).
function Picture({ name, widths, sizes, alt, eager = false, width, height, className = "" }) {
    return (
        <img
            src={`/img/${name}-${widths[1] || widths[0]}.webp`}
            srcSet={widths.map(w => `/img/${name}-${w}.webp ${w}w`).join(", ")}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            // React 18 only passes this through in lowercase.
            // eslint-disable-next-line react/no-unknown-property
            fetchpriority={eager ? "high" : undefined}
            className={className}
        />
    );
}

const PROJECT_WIDTHS = [640, 960, 1440];

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
            {/* Aurora: two slow-drifting gradients (transform-only animation). */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="aurora-a" />
                <span className="aurora-b" />
            </div>

            <div className="relative mx-auto grid max-w-content items-center gap-14 px-5 pb-16 pt-32 sm:px-8 md:pb-20 md:pt-40 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75 motion-reduce:hidden" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
                        </span>
                        {profile.role}
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {profile.location}</span>
                    </p>
                    <h1 className="mt-7 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl xl:text-[4.1rem]">
                        Hi, I’m {profile.name}.
                        <span className="mx-auto mt-4 block max-w-3xl bg-gradient-to-r from-accent-700 to-sky-700 bg-clip-text pb-1 text-2xl font-bold leading-[1.3] text-transparent sm:text-3xl lg:mx-0 lg:text-[2.1rem] dark:from-accent-300 dark:to-sky-400">
                            {profile.headline}
                        </span>
                    </h1>
                    <p className="mt-5 font-mono text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-accent-600 dark:text-accent-400">&gt;</span> focus:{" "}
                        <span className="font-semibold text-slate-900 dark:text-white">
                            <TypedWords words={profile.focus} />
                        </span>
                    </p>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">{profile.intro}</p>
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <a href="#projects" className="btn-primary">
                            View my work <ArrowRight size={16} />
                        </a>
                        <a href="#contact" className="btn-ghost">Get in touch</a>
                        <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block dark:bg-white/10" />
                        <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">
                            <GitHubIcon className="h-5 w-5" />
                        </a>
                        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white">
                            <LinkedInIcon className="h-5 w-5" />
                        </a>
                </div>

                {/* Career path, oldest to current */}
                <ol className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-600 lg:justify-start dark:text-slate-400" aria-label="Career path">
                    {[...experience].reverse().map((job, i, all) => (
                        <li key={job.company} className="flex items-center gap-3">
                            <span className={i === all.length - 1 ? "rounded-full bg-accent-50 px-3 py-1 font-semibold text-accent-800 ring-1 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/30" : "font-medium"}>
                                {job.company}
                            </span>
                            {i < all.length - 1 && <ArrowRight size={14} aria-hidden="true" className="text-slate-400" />}
                        </li>
                    ))}
                </ol>
                </div>

                <div className="mx-auto hidden w-full max-w-md md:block lg:max-w-none">
                    <CodeCard file={profile.codeCard.file} fields={profile.codeCard.fields} />
                </div>
            </div>
        </section>
    );
}

export function About() {
    return (
        <section id="about" className="section">
            <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-12">
                <SectionHeader eyebrow="About" title={profile.aboutTitle} />
                <div className="reveal space-y-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {profile.about.map(p => (
                        <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                </div>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {profile.stats.map(s => {
                    const Icon = STAT_ICONS[s.icon];
                    return (
                        <li key={s.label} className="reveal">
                            <TiltCard as="div" max={4} className="card flex h-full items-center gap-4 overflow-hidden p-5 sm:flex-col sm:items-start sm:p-6">
                                <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgb(31_163_163/0.18),transparent_70%)]" />
                                {Icon && (
                                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/25">
                                        <Icon size={20} aria-hidden="true" />
                                    </span>
                                )}
                                <div className="flex flex-1 items-baseline justify-between gap-4 sm:flex-col-reverse sm:gap-1">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
                                    <p className="bg-gradient-to-r from-slate-900 to-accent-700 bg-clip-text font-display text-3xl font-extrabold text-transparent sm:text-5xl dark:from-white dark:to-accent-300">
                                        {s.count != null ? <CountUp to={s.count} prefix={s.prefix} suffix={s.suffix} /> : <DecodeText text={s.value} />}
                                    </p>
                                </div>
                            </TiltCard>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

// Makes figures like "40%" stand out inside a sentence.
function HighlightNumbers({ text }) {
    return text.split(/(\d+%)/).map((part, i) =>
        /^\d+%$/.test(part) ? (
             
            <strong key={i} className="rounded bg-accent-50 px-1 font-bold text-accent-800 dark:bg-accent-500/10 dark:text-accent-300">
                {part}
            </strong>
        ) : (
            part
        )
    );
}

// Company mark: the capital letters of the name (V, GL, W).
function CompanyMark({ name, current }) {
    return (
        <span
            aria-hidden="true"
            className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl font-display text-sm font-extrabold tracking-tight ${
                current
                    ? "bg-gradient-to-br from-accent-500 to-sky-600 text-white shadow-lg shadow-accent-500/25"
                    : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
            }`}
        >
            {name.match(/[A-Z]/g).join("")}
        </span>
    );
}

export function Experience() {
    return (
        <section id="experience" className="border-y border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-white/[0.015]">
            <div className="section">
                <SectionHeader eyebrow="Experience" title="Where I’ve worked" />
                {/* Timeline: a rail with a dot per role (rail hidden on small screens). */}
                <ol className="relative mt-12 space-y-6 md:pl-10">
                    <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 hidden w-px bg-gradient-to-b from-accent-500 via-slate-300 to-transparent md:block dark:via-white/15" />
                    {experience.map((job, i) => (
                        <li key={job.company} className="reveal relative">
                            <span
                                aria-hidden="true"
                                className={`absolute -left-10 top-8 hidden h-[23px] w-[23px] items-center justify-center rounded-full border-4 border-slate-50 md:flex dark:border-[#0e1719] ${i === 0 ? "bg-accent-500" : "bg-slate-300 dark:bg-slate-600"}`}
                            />
                            <div className="card grid gap-5 p-5 transition-colors hover:border-accent-400/50 sm:p-8 md:grid-cols-[210px_1fr] md:gap-6">
                                <div>
                                    <CompanyMark name={job.company} current={i === 0} />
                                    <p className="mt-4 font-mono text-xs text-slate-600 dark:text-slate-400">{job.period}</p>
                                    <h3 className="mt-1 text-xl font-bold">{job.company}</h3>
                                    <p className="text-sm font-medium text-accent-700 dark:text-accent-400">{job.role}</p>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{job.context}</p>
                                </div>
                                <div>
                                    {job.metrics && (
                                        <ul className="mb-6 grid grid-cols-3 gap-3">
                                            {job.metrics.map(m => (
                                                <li key={m.label} className="rounded-xl border border-accent-200/70 bg-accent-50/60 px-3 py-3 dark:border-accent-500/20 dark:bg-accent-500/[0.06]">
                                                    <p className="font-display text-2xl font-extrabold text-accent-700 sm:text-3xl dark:text-accent-300">
                                                        <CountUp to={m.count} suffix={m.suffix} />
                                                    </p>
                                                    <p className="mt-0.5 text-xs leading-snug text-slate-600 dark:text-slate-400">{m.label}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <ul className="space-y-3">
                                        {job.points.map(point => (
                                            <li key={point.slice(0, 32)} className="flex gap-3 text-[15px] leading-relaxed">
                                                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                                                <span><HighlightNumbers text={point} /></span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {job.stack.map(t => (
                                            <span key={t} className="tag">{t}</span>
                                        ))}
                                    </div>
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
                    <div key={group.group} className={`reveal card p-5 sm:p-6 ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{group.group}</h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {group.items.map(item => (
                                <li key={item} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800 dark:border-white/10 dark:text-slate-200">
                                    <SkillIcon name={item} />
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

export function Learning() {
    return (
        <section aria-labelledby="learning-title" className="mx-auto max-w-content px-5 pb-20 sm:px-8 md:pb-28">
            <div className="reveal flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="eyebrow inline-flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75 motion-reduce:hidden" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                        </span>
                        Now
                    </p>
                    <h2 id="learning-title" className="section-title">Currently learning</h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">What I’m picking up next, mostly by building with it in side projects.</p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {learning.map(item => {
                    const Icon = LEARNING_ICONS[item.icon] || Sparkles;
                    return (
                        <li key={item.title} className="reveal">
                            <TiltCard as="div" max={5} className="card h-full p-5">
                                <div className="flex items-center justify-between">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/25">
                                        <Icon size={19} aria-hidden="true" />
                                    </span>
                                    <span className="rounded-full border border-dashed border-accent-400/60 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent-700 dark:text-accent-300">
                                        In progress
                                    </span>
                                </div>
                                <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.detail}</p>
                            </TiltCard>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function ProjectLinks({ project }) {
    const { live, github } = project.links;
    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            {live && (
                <a href={live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-900 hover:text-accent-700 dark:text-white dark:hover:text-accent-400">
                    Live demo <ArrowUpRight size={15} /><span className="sr-only">: {project.title}</span>
                </a>
            )}
            {github && (
                <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <GitHubIcon className="h-4 w-4" /> Code<span className="sr-only">: {project.title}</span>
                </a>
            )}
            {!live && !github && <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Personal tool, in daily use</span>}
        </div>
    );
}

function Tags({ items }) {
    return (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {items.map(t => <li key={t} className="tag">{t}</li>)}
        </ul>
    );
}

function FeaturedProject({ project }) {
    return (
        <div className="reveal">
            <TiltCard max={2.5} className="card group grid overflow-hidden lg:grid-cols-[1.25fr_1fr]">
                <div className="aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100 lg:aspect-auto lg:border-b-0 lg:border-r dark:border-white/10 dark:bg-white/5">
                    <Picture
                        name={project.image}
                        widths={PROJECT_WIDTHS}
                        sizes="(min-width: 1152px) 620px, (min-width: 1024px) 55vw, 100vw"
                        alt={`${project.title} screenshot`}
                        width={1440}
                        height={810}
                        className="h-full w-full object-cover object-left-top transition duration-500 group-hover:scale-[1.02]"
                    />
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                    <p className="eyebrow">Featured project</p>
                    <div className="mt-2 flex items-baseline justify-between gap-3">
                        <h3 className="text-2xl font-bold">{project.title}</h3>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{project.year}</span>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
                    {project.highlights && (
                        <ul className="mt-5 space-y-2.5">
                            {project.highlights.map(h => (
                                <li key={h} className="flex gap-2.5 text-sm leading-relaxed">
                                    <Check className="mt-0.5 h-4 w-4 flex-none text-accent-600 dark:text-accent-400" aria-hidden="true" />
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-6"><Tags items={project.stack} /></div>
                    <div className="mt-auto pt-6">
                        <div className="border-t border-slate-100 pt-5 dark:border-white/5">
                            <ProjectLinks project={project} />
                        </div>
                    </div>
                </div>
            </TiltCard>
        </div>
    );
}

function ProjectCard({ project }) {
    return (
        <div className="reveal">
            <TiltCard className="card group flex h-full flex-col overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                    <Picture
                        name={project.image}
                        widths={PROJECT_WIDTHS}
                        sizes="(min-width: 1152px) 360px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                        alt={`${project.title} screenshot`}
                        width={1440}
                        height={810}
                        className="h-full w-full object-cover object-left-top transition duration-500 group-hover:scale-[1.03]"
                    />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-bold">{project.title}</h3>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{project.year}</span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.description}</p>
                    <div className="mt-4"><Tags items={project.stack} /></div>
                    <div className="mt-5 border-t border-slate-100 pt-4 dark:border-white/5">
                        <ProjectLinks project={project} />
                    </div>
                </div>
            </TiltCard>
        </div>
    );
}

export function Projects() {
    const [featured, ...rest] = projects;
    return (
        <section id="projects" className="border-t border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-white/[0.015]">
            <div className="section">
                <SectionHeader eyebrow="Projects" title="Things I’ve built">
                    Side projects where I own everything, from the data model to deployment.
                </SectionHeader>
                <div className="mt-12 space-y-6">
                    <FeaturedProject project={featured} />
                    {/* Three columns only when the cards fill whole rows; otherwise two. */}
                    <div className={`grid gap-6 sm:grid-cols-2 ${rest.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
                        {rest.map(project => <ProjectCard key={project.title} project={project} />)}
                    </div>
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
                                {c.year && <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{c.year}</span>}
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
            <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-slate-600 sm:flex-row sm:px-8 dark:text-slate-400">
                <p className="text-center sm:text-left">© {new Date().getFullYear()} {profile.name}. Built with React &amp; Tailwind CSS.</p>
                <div className="flex items-center gap-1">
                    <a href={`mailto:${profile.email}`} aria-label="Email" className="rounded-full p-2.5 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"><Mail size={18} /></a>
                    <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2.5 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"><GitHubIcon className="h-[18px] w-[18px]" /></a>
                    <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full p-2.5 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"><LinkedInIcon className="h-[18px] w-[18px]" /></a>
                    <a href={profile.resume} download className="inline-flex items-center gap-1 rounded-full px-3 py-2 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"><Download size={16} /> Résumé</a>
                    <a href="#top" aria-label="Back to top" className="ml-1 rounded-full border border-slate-200 p-2.5 hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:hover:text-white"><ArrowUp size={16} /></a>
                </div>
            </div>
        </footer>
    );
}
