import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useRef } from "react";

import { ProChat } from "@ant-design/pro-chat";
import { chatContext } from "../../context/index";
import { genResponseStream } from "../../utils/stream";
import { getResponse } from "../../apis/langchain-chat";
import { chatWorkspaceInnerClass, useProChatSurfaceStyle } from "../_sharedUi";

export const Route = createFileRoute("/langchain-chat/_langchain-chat/")({
  component: ChatComponent,
});

function ChatComponent() {
  const nav = useNavigate();
  const context = useContext(chatContext) as any;
  const proChatStyle = useProChatSurfaceStyle();
  const chatIdRef = useRef(null);
  const firstChatCompleted = async () => {
    await context.getData();
    nav({ to: `/langchain-chat/${chatIdRef.current}` });
  };

  useEffect(() => {
    return () => {
      chatIdRef.current = null;
    };
  }, []);

  return (
    <div className={chatWorkspaceInnerClass}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ProChat
          className="min-h-0 flex-1"
          style={proChatStyle}
          request={async (chats) => {
          const messages = chats.map((chat) => ({
            id: chatIdRef.current || "",
            role: chat.role,
            content: chat.content,
          }));
          const response = await getResponse({ messages });
          return new Response(genResponseStream(response.clone(), chatIdRef, firstChatCompleted));
        }}
        />
      </div>
    </div>
  );
}
