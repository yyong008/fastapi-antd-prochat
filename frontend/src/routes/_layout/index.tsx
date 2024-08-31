import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h1>ZhiPU AI + Antd Pro Chat</h1>
      <h1>Python(FastAPI), React(Vite, tanstack router)</h1>
    </div>
  );
}
