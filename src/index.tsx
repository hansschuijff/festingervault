import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import App from "./App";
const container_id = "app";

if (window.document.getElementById(container_id)) {
  const root = createRoot(document.getElementById(container_id));
  root.render(<App />);
}
