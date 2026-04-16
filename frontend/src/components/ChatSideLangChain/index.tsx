import { ChatSideShell } from "../ChatSide/ChatSideShell";

/** /langchain-chat 侧栏（会话链接与删除后回退到 langchain-chat） */
export const ChatSide = ({ isLoading }: { isLoading: boolean }) => (
  <ChatSideShell variant="langchain" isLoading={isLoading} />
);
