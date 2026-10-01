import { ArrowRight, ArrowUpRight, ArrowUp, Check, Download, MapPin, Mail } from "lucide-react";
import { profile, experience, skills, projects, credentials } from "../data.js";
import { GitHubIcon, LinkedInIcon } from "./Icons.jsx";

// Responsive WebP from /public/img/<name>-<width>.webp. `eager` is for the
// above-the-fold hero photo (loads first, high priority).
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
            {/* Grid + glow are plain gradients: cheap to paint, unlike CSS blur. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(148_163_184/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.12)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_-5%,rgb(56_191_189/0.22),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_45%_at_50%_-5%,rgb(31_163_163/0.16),transparent_70%)]" />

            <div className="relative mx-auto grid max-w-content items-center gap-12 px-5 pb-16 pt-28 sm:px-8 md:grid-cols-[1.4fr_1fr] md:gap-14 md:pb-28 md:pt-40">
                <div className="order-2 md:order-1">
                    <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                        {profile.role}
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {profile.location}</span>
                    </p>
                    <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                        Hi, I’m {profile.name}.
                        <span className="mt-3 block bg-gradient-to-r from-accent-700 to-sky-700 bg-clip-text text-2xl font-bold leading-snug text-transparent sm:text-3xl lg:text-[2.1rem] dark:from-accent-300 dark:to-sky-400">
                            {profile.headline}
                        </span>
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">{profile.intro}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
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
                </div>

                <div className="relative order-1 mx-auto w-48 sm:w-60 md:order-2 md:w-full md:max-w-sm">
                    <div aria-hidden="true" className="absolute -inset-2.5 rotate-3 rounded-[2rem] bg-gradient-to-br from-accent-400 to-sky-500 opacity-80 sm:-inset-3" />
                    <Picture
                        name={profile.photo}
                        widths={[320, 480, 640]}
                        sizes="(min-width: 768px) 384px, (min-width: 640px) 240px, 192px"
                        alt={`Portrait of ${profile.name}`}
                        width={640}
                        height={640}
                        eager
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
            <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-12">
                <SectionHeader eyebrow="About" title="Frontend engineer who cares about the details." />
                <div className="reveal space-y-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {profile.about.map(p => (
                        <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                </div>
            </div>
            <dl className="reveal mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {profile.stats.map(s => (
                    <div key={s.label} className="card flex items-baseline justify-between gap-4 p-5 sm:block sm:p-6">
                        <dt className="text-sm text-slate-600 dark:text-slate-400">{s.label}</dt>
                        <dd className="font-display text-3xl font-extrabold text-slate-900 sm:mt-2 sm:text-4xl dark:text-white">{s.value}</dd>
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
                {/* Timeline: a rail with a dot per role (rail hidden on small screens). */}
                <ol className="relative mt-12 space-y-6 md:pl-10">
                    <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 hidden w-px bg-gradient-to-b from-accent-500 via-slate-300 to-transparent md:block dark:via-white/15" />
                    {experience.map((job, i) => (
                        <li key={job.company} className="reveal relative">
                            <span
                                aria-hidden="true"
                                className={`absolute -left-10 top-8 hidden h-[23px] w-[23px] items-center justify-center rounded-full border-4 border-slate-50 md:flex dark:border-[#0e1719] ${i === 0 ? "bg-accent-500" : "bg-slate-300 dark:bg-slate-600"}`}
                            />
                            <div className="card grid gap-5 p-5 sm:p-8 md:grid-cols-[210px_1fr] md:gap-6">
                                <div>
                                    <p className="font-mono text-xs text-slate-600 dark:text-slate-400">{job.period}</p>
                                    <h3 className="mt-2 text-xl font-bold">{job.company}</h3>
                                    <p className="text-sm font-medium text-accent-700 dark:text-accent-400">{job.role}</p>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{job.context}</p>
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
        <article className="reveal card group grid overflow-hidden lg:grid-cols-[1.25fr_1fr]">
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
        </article>
    );
}

function ProjectCard({ project }) {
    return (
        <article className="reveal card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
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
        </article>
    );
}

export function Projects() {
    const [featured, ...rest] = projects;
    return (
        <section id="projects" className="border-t border-slate-200 bg-slate-50/70 dark:border-white/5 dark:bg-white/[0.015]">
            <div className="section">
                <SectionHeader eyebrow="Projects" title="Things I’ve built">
                    Side projects where I own everything, from the data model to deployment. All live, all with source code.
                </SectionHeader>
                <div className="mt-12 space-y-6">
                    <FeaturedProject project={featured} />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
