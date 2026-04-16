import { ChatSideShell } from "../ChatSide/ChatSideShell";

/** /ollama 侧栏（会话链接与删除后回退到 /ollama） */
export const ChatSide = ({ isLoading }: { isLoading: boolean }) => (
  <ChatSideShell variant="ollama" isLoading={isLoading} />
);
