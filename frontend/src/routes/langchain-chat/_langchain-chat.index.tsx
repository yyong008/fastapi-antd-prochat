import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useRef } from "react";

import { ProChat } from "@ant-design/pro-chat";
import { chatContext } from "../../context/index"
import { genResponseStream } from "../../utils/stream";
import { getResponse } from "../../apis/langchain-chat";
import { useTheme } from "antd-style";

export const Route = createFileRoute('/langchain-chat/_langchain-chat/')({
  component: ChatComponent
})

function ChatComponent() {
  const nav = useNavigate();
  const context = useContext(chatContext) as any
  const theme = useTheme();
  const chatIdRef = useRef(null);
  const firstChatCompleted = async () => {
    await context.getData();
    nav({to: `/langchain-chat/${chatIdRef.current}`})
  }

  useEffect(() => {
    return () => {
      chatIdRef.current = null;
    };
  }, []);

  return (
    <>
      <ProChat
        style={{
          background: theme.colorBgLayout,
        }}
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
    </>
  );
}


