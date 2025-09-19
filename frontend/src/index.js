import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

// This is the new, correct way to render a React 18+ app.
// 1. Find the container div from your HTML.
const container = document.getElementById("app");

// 2. Create a "root" for the React app to live in.
const root = createRoot(container);

// 3. Render your App component into that root.
root.render(<App />);
