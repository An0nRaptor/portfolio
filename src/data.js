// All site content lives here. Update this file, not the components.

export const profile = {
    name: "Rahul Yadav",
    role: "Frontend Developer",
    location: "Pune, India",
    email: "rahulyadavaudi06@gmail.com",
    photo: "rahul", // responsive WebP set: rahul-320/480/640.webp
    // Drop the final PDF into /public with this name.
    resume: "/Rahul_Yadav_Resume.pdf",
    links: {
        github: "https://github.com/An0nRaptor",
        linkedin: "https://www.linkedin.com/in/rahul-yadav-0506501a0/"
    },
    headline:
        "I build fast, accessible React interfaces for products people rely on every day.",
    intro:
        "Frontend Developer with 5 years of experience across Wipro, GlobalLogic and Virtusa. I'm currently building features on a single-spa micro-frontend platform for a leading US insurer, covering UI, analytics instrumentation, testing and CI/CD.",
    aboutTitle: "Building scalable, high-performance interfaces.",
    about: [
        "Frontend engineer with 5 years across Wipro, GlobalLogic and Virtusa, specialising in React, TypeScript and micro-frontend architecture.",
        "At Wipro I cut an e-commerce platform’s page load time by 40%; at GlobalLogic I built shared component libraries and micro-frontends for enterprise products. Today at Virtusa, I ship policy-servicing features for a leading US insurer, from React UI and analytics to tested, feature-toggled releases.",
        "Outside work, I build full-stack apps with React, Node.js and MongoDB."
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
        company: "GlobalLogic",
        role: "Senior Software Developer",
        period: "May 2025 – Jun 2026",
        context: "Enterprise React and Node.js applications",
        points: [
            "Led architectural discussions and technical decisions to improve the scalability and maintainability of enterprise React and Node.js applications.",
            "Defined and enforced coding standards and performance benchmarks, keeping large-scale modules consistent and fast.",
            "Built reusable component libraries and micro-frontends, improving consistency and accelerating delivery across multiple product lines."
        ],
        stack: ["React", "TypeScript", "Node.js", "Micro-frontends", "Component libraries"]
    },
    {
        company: "Wipro",
        role: "Frontend Engineer",
        period: "Nov 2021 – May 2025",
        context: "E-commerce platform",
        points: [
            "Built reusable React components and custom hooks, cutting UI development time by 20% and keeping the interface consistent.",
            "Improved performance with lazy loading, code splitting and image optimisation, reducing page load time by 40%.",
            "Partnered with UX and backend teams on UI enhancements that increased user engagement by 25%, integrating product data through RESTful APIs for real-time updates.",
            "Built responsive layouts with CSS Grid and Flexbox and custom Material-UI themes aligned with brand guidelines.",
            "Mentored junior developers through code reviews and knowledge-sharing sessions."
        ],
        stack: ["React", "Redux", "Material-UI", "REST APIs", "CSS Grid/Flexbox"]
    }
];

export const skills = [
    {
        group: "Frontend",
        items: ["React", "TypeScript", "JavaScript (ES6+)", "Redux", "React Query", "React Router", "single-spa", "HTML5", "CSS3", "Tailwind CSS", "Material-UI", "Styled Components", "shadcn/ui"]
    },
    {
        group: "Testing & Quality",
        items: ["Jest", "React Testing Library", "ESLint", "SonarQube", "Cross-browser testing"]
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
        items: ["Git", "GitHub", "Webpack", "Vite", "npm", "Jenkins", "Vercel", "Netlify", "Postman", "Figma"]
    }
];

// First project is shown as the large featured card. `image` is the base
// name of the responsive WebP set in /public/img (name-640/960/1440.webp).
export const projects = [
    {
        title: "TravelNest Booking",
        year: "2026",
        description:
            "An Airbnb-style booking app: search stays, browse photo galleries and book dates with server-side pricing and double-booking protection. Hosts can list, edit and manage their own places with photo uploads.",
        highlights: [
            "React + Express API deployed as one Netlify site (serverless functions, no CORS)",
            "Server-side pricing, date validation and double-booking protection",
            "Photos stored in MongoDB GridFS and compressed in the browser before upload",
            "One-click demo account so anyone can try booking"
        ],
        stack: ["React", "Tailwind", "Express", "MongoDB", "JWT", "Netlify Functions"],
        image: "travelnest",
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
        image: "memories",
        links: {
            live: "https://create-memories-webapp.netlify.app/",
            github: "https://github.com/An0nRaptor/Mern_memories_webapp"
        }
    },
    {
        title: "SnippetVault",
        year: "2026",
        description:
            "A personal tool that syncs files and code snippets between machines using Google Drive as the storage backend. Includes a server-side OAuth 2.0 flow with encrypted refresh-token cookies, resumable chunked uploads and in-browser zip browsing.",
        stack: ["React", "Vite", "Tailwind", "Google Drive API", "OAuth 2.0", "Vercel"],
        image: "snippetvault",
        links: {}
    },
    {
        title: "Blogging Platform",
        year: "2024",
        description:
            "A full-stack blogging platform with publishing, drafts, post analytics, likes, nested comment replies and real-time notifications.",
        stack: ["React", "Node.js", "Express", "MongoDB", "Firebase Auth"],
        image: "blog",
        links: {
            live: "https://blogging-mern-webapp.netlify.app/",
            github: "https://github.com/An0nRaptor/Blogging_mern_webapp"
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
