import Navbar from "./components/Navbar.jsx";
import { Hero, About, Experience, Skills, Projects, Credentials, Footer } from "./components/Sections.jsx";
import Contact from "./components/Contact.jsx";
import useReveal from "./useReveal.js";

export default function App() {
    useReveal();
    return (
        <>
            <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow">
                Skip to content
            </a>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Experience />
                <Skills />
                <Projects />
                <Credentials />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
