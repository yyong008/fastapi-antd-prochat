/** 全应用统一模块路由（首页侧栏、功能卡片、后续可复用到各 ChatSide） */

export type ModuleKey =
  | "overview"
  | "chat"
  | "langchain"
  | "ollama"
  | "translate"
  | "knowledge";

export type AppModuleRoute = {
  key: ModuleKey;
  /** TanStack Router 的 path，与 createFileRoute 一致 */
  to: string;
  label: string;
  shortLabel: string;
};

export const OVERVIEW: AppModuleRoute = {
  key: "overview",
  to: "/",
  label: "概览",
  shortLabel: "概览",
};

export const APP_MODULES: AppModuleRoute[] = [
  { key: "chat", to: "/chat", label: "AI 对话", shortLabel: "对话" },
  { key: "langchain", to: "/langchain-chat", label: "LangChain", shortLabel: "LangChain" },
  { key: "ollama", to: "/ollama", label: "Ollama 本地", shortLabel: "Ollama" },
  { key: "translate", to: "/translate", label: "翻译助手", shortLabel: "翻译" },
  { key: "knowledge", to: "/knowledge", label: "知识库", shortLabel: "知识库" },
];

/** 当前 path 是否属于某模块（用于侧栏高亮） */
export function isRouteActive(pathname: string, to: string): boolean {
  const p = (pathname.replace(/\/$/, "") || "/") as string;
  const t = (to.replace(/\/$/, "") || "/") as string;
  if (t === "/") {
    return p === "/";
  }
  return p === t || p.startsWith(`${t}/`);
}
