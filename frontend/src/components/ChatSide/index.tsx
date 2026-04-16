import { ChatSideShell } from "./ChatSideShell";

/** /chat 侧栏 */
export const ChatSide = ({ isLoading }: { isLoading: boolean }) => (
  <ChatSideShell variant="chat" isLoading={isLoading} />
);
