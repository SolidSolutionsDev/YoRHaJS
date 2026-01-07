import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// @ts-ignore
import "yorha/dist/yorha.min.css";
import App from "./App";
// @ts-ignore
import registerServiceWorker from "./registerServiceWorker";

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

registerServiceWorker();
