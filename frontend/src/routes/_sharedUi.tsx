import type { CSSProperties } from "react";

import { useTheme } from "antd-style";

/** ProChat 区域统一背景（随 ConfigProvider / antd-style token） */
export function useProChatSurfaceStyle(): CSSProperties {
  const theme = useTheme();
  return { background: theme.colorBgLayout };
}

/** 新建对话 / Ollama / LangChain：中间工作区宽度与留白 */
export const chatWorkspaceInnerClass =
  "mx-auto flex h-full min-h-0 w-full max-w-5xl flex-1 flex-col px-3 pb-4 pt-2 sm:px-5 sm:pt-4";
