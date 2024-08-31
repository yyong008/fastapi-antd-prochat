import App from "./App.tsx";
import { createRoot } from "react-dom/client";
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
