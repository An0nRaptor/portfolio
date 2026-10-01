import { renderToString } from "react-dom/server";
import App from "./App.jsx";

// Used at build time only, to pre-render the page to static HTML.
export function render() {
    return renderToString(<App />);
}
