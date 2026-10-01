// All site content lives here. Update this file, not the components.

export const profile = {
    name: "Rahul Yadav",
    role: "Frontend Developer",
    location: "Pune, India",
    email: "rahulyadavaudi06@gmail.com",
    photo: "/img/rahul.jpg",
    // Drop the final PDF into /public with this name.
    resume: "/Rahul_Yadav_Resume.pdf",
    links: {
        github: "https://github.com/An0nRaptor",
        linkedin: "https://www.linkedin.com/in/rahul-yadav-0506501a0/"
    },
    headline:
        "I build fast, accessible React interfaces for products people rely on every day.",
    intro:
        "Frontend Developer with 5 years of experience. I'm currently building features on a single-spa micro-frontend platform for a leading US insurer, covering UI, analytics instrumentation, testing and CI/CD.",
    about: [
        "I started out building a large e-commerce platform at Wipro. There I learned that performance and consistency are features: reusable component libraries, lazy loading and code splitting took page load time down by 40%.",
        "Today at Virtusa I work across several independently deployed micro-frontends that share one design system. I take policy-servicing features from design hand-off to production: React UI, Adobe Analytics tracking, Jest coverage and feature-toggled releases.",
        "Outside work I build full-stack side projects with the MERN stack and my own tools, like SnippetVault, which I use daily to move code between machines."
    ],
    stats: [
        { value: "5", label: "Years building for the web" },
        { value: "40%", label: "Faster page loads delivered" },
        { value: "MFE", label: "Micro-frontend platform experience" }
    ]
};

export const experience = [
    {
        company: "Virtusa",
        role: "UI Developer",
        period: "Jul 2026 – Present",
        context: "Leading US insurance client · Customer policy-servicing platform",
        points: [
            "Develop and maintain React features across multiple single-spa micro-frontends (policy management, protection details, documents) built on a shared component library and design system.",
            "Built policy-change features including LLC/Trust member management, a fortified-roof discount flow and state-specific coverage rules for a new-state rollout.",
            "Implemented Adobe Analytics tracking through Adobe Launch rules (page-load and click events, props/eVars) and validated data across environments.",
            "Wrote Jest unit tests to meet coverage and SonarQube quality gates, and shipped feature-toggled releases through Jenkins CI/CD.",
            "Root-caused production UI defects, including a layout regression traced to a shared component-library upgrade."
        ],
        stack: ["React", "single-spa", "Jest", "Adobe Launch", "SonarQube", "Jenkins"]
    },
    {
        company: "Wipro",
        role: "Frontend Developer",
        period: "Nov 2021 – Jun 2026",
        context: "E-commerce platform",
        points: [
            "Built reusable React components, cutting UI development time by 20% and keeping the interface consistent.",
            "Improved performance with lazy loading, code splitting and image optimisation, reducing page load time by 40%.",
            "Partnered with UX and backend teams on UI enhancements that increased user engagement by 25%.",
            "Integrated product data through RESTful APIs and built custom Material-UI themes aligned with brand guidelines.",
            "Mentored junior developers through code reviews and knowledge-sharing sessions."
        ],
        stack: ["React", "Redux", "Material-UI", "REST APIs"]
    }
];

export const skills = [
    {
        group: "Frontend",
        items: ["React", "Redux", "JavaScript (ES6+)", "HTML5", "CSS3", "single-spa", "Tailwind CSS", "Material-UI", "shadcn/ui", "Radix UI"]
    },
    {
        group: "Testing & Quality",
        items: ["Jest", "ESLint", "SonarQube", "Cross-browser testing"]
    },
    {
        group: "Analytics",
        items: ["Adobe Analytics", "Adobe Launch"]
    },
    {
        group: "Backend & Data",
        items: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JWT auth"]
    },
    {
        group: "Tools & Delivery",
        items: ["Git", "GitHub", "Vite", "npm", "Jenkins", "Vercel", "Netlify", "Postman", "Figma"]
    }
];

export const projects = [
    {
        title: "SnippetVault",
        year: "2026",
        description:
            "A personal tool that syncs files and code snippets between machines using Google Drive as the storage backend. Includes a server-side OAuth 2.0 flow with encrypted refresh-token cookies, resumable chunked uploads and in-browser zip browsing.",
        stack: ["React", "Vite", "Tailwind", "Google Drive API", "OAuth 2.0", "Vercel"],
        image: null, // rendered as a code-window illustration
        links: {}
    },
    {
        title: "Blogging Platform",
        year: "2024",
        description:
            "A full-stack blogging platform with publishing, drafts, post analytics, likes, nested comment replies and real-time notifications.",
        stack: ["React", "Node.js", "Express", "MongoDB", "Firebase Auth"],
        image: "/img/blog.png",
        links: {
            live: "https://blogging-mern-webapp.netlify.app/",
            github: "https://github.com/An0nRaptor/Blogging_mern_webapp"
        }
    },
    {
        title: "TravelNest Booking",
        year: "2026",
        description:
            "An Airbnb-style booking app: search stays, browse photo galleries and book dates with server-side pricing and double-booking protection. Hosts can list, edit and manage their own places with photo uploads.",
        stack: ["React", "Tailwind", "Express", "MongoDB", "JWT", "Netlify Functions"],
        image: "/img/booking.png",
        links: {
            live: "https://mern-booking-webapp.netlify.app",
            github: "https://github.com/An0nRaptor/Booking_webapp"
        }
    },
    {
        title: "Memories",
        year: "2026",
        description:
            "A social app for travel moments: photo posts with likes, comments, tags, search, profiles and dark mode. Likes update instantly through optimistic Redux Toolkit Query cache updates.",
        stack: ["React", "Redux Toolkit", "Material UI", "Express", "MongoDB"],
        image: "/img/memories.png",
        links: {
            live: "https://create-memories-webapp.netlify.app/",
            github: "https://github.com/An0nRaptor/Mern_memories_webapp"
        }
    }
];

export const credentials = [
    { title: "Namaste React", detail: "React certification", year: "2024" },
    { title: "HTML, CSS, and JavaScript for Web Developers", detail: "Coursera", year: "2024" },
    {
        title: "MDN Web Docs contributor",
        detail: "Improved the “Comparing dates and strings” section of the JavaScript reference",
        year: "",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality#comparing_dates_and_strings"
    },
    {
        title: "B.E., Computer Science and Engineering",
        detail: "AISSMS College of Engineering, Pune",
        year: "2021"
    }
];
