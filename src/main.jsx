import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");
const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

// The production build pre-renders the page into #root (see prerender.mjs),
// so React attaches to that HTML instead of rebuilding it.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
