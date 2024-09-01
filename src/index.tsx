import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "./App";
const container_id = "app";
const el = document.getElementById(container_id);
if (el) {
	const root = createRoot(el);
	root.render(<App />);
}
