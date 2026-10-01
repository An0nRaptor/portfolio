import { useState } from "react";
import { Mail, Send, CheckCircle2, Copy, Check } from "lucide-react";
import { profile } from "../data.js";
import { LinkedInIcon } from "./Icons.jsx";

// Netlify Forms: posts url-encoded data to "/" with form-name matching the
// hidden static form in index.html. Only works on a Netlify deploy.
const encode = data =>
    Object.entries(data)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "", "bot-field": "" });
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error
    const [copied, setCopied] = useState(false);

    const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        setStatus("sending");
        try {
            const res = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode({ "form-name": "contact", ...form })
            });
            if (!res.ok) throw new Error(String(res.status));
            setStatus("sent");
            setForm({ name: "", email: "", message: "", "bot-field": "" });
        } catch {
            setStatus("error");
        }
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked: the mailto link still works */
        }
    };

    return (
        <section id="contact" className="section">
            <div className="reveal card relative overflow-hidden p-5 sm:p-12">
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
                <div className="relative grid gap-12 md:grid-cols-2">
                    <div>
                        <p className="eyebrow">Contact</p>
                        <h2 className="section-title">Let’s build something together.</h2>
                        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                            I’m open to frontend roles and interesting collaborations. Send a message and I’ll get back to you, usually within a day.
                        </p>
                        <div className="mt-8 space-y-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <a href={`mailto:${profile.email}`} className="inline-flex min-w-0 items-center gap-3 break-all font-medium text-slate-900 hover:text-accent-600 dark:text-white dark:hover:text-accent-400">
                                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-100 dark:bg-white/5"><Mail size={18} /></span>
                                    {profile.email}
                                </a>
                                <button onClick={copyEmail} className="flex-none rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Copy email address" title="Copy email">
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 font-medium text-slate-900 hover:text-accent-600 dark:text-white dark:hover:text-accent-400">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5"><LinkedInIcon className="h-[18px] w-[18px]" /></span>
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>

                    {status === "sent" ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-accent-200 bg-accent-50 p-8 text-center dark:border-accent-500/20 dark:bg-accent-500/5">
                            <CheckCircle2 className="h-10 w-10 text-accent-600 dark:text-accent-400" />
                            <h3 className="mt-4 text-lg font-bold">Message sent, thank you!</h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">I’ll reply to the email you gave.</p>
                            <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">Send another</button>
                        </div>
                    ) : (
                        <form name="contact" onSubmit={submit} className="space-y-4">
                            <p hidden>
                                <label>Don’t fill this out: <input name="bot-field" value={form["bot-field"]} onChange={update} /></label>
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
                                    <input className="field" name="name" required autoComplete="name" value={form.name} onChange={update} />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                                    <input className="field" type="email" name="email" required autoComplete="email" value={form.email} onChange={update} />
                                </label>
                            </div>
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
                                <textarea className="field min-h-[140px] resize-y" name="message" required value={form.message} onChange={update} />
                            </label>
                            {status === "error" && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    Something went wrong. Please email me directly at {profile.email}.
                                </p>
                            )}
                            <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
                                {status === "sending" ? "Sending…" : <>Send message <Send size={15} /></>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
