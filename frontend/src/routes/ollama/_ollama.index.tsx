import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useRef } from "react";

import { ProChat } from "@ant-design/pro-chat";
import { chatContext } from "../../context/index";
import { genResponseStream } from "../../utils/stream";
import { getResponse } from "../../apis/ollama";
import { message } from "antd";
import { ollamaContext } from "../../context";
import { useProChatSurfaceStyle } from "../_sharedUi";

export const Route = createFileRoute("/ollama/_ollama/")({
  component: ChatComponent,
});

function ChatComponent() {
  const oc = useContext(ollamaContext) as any;
  const nav = useNavigate();
  const context = useContext(chatContext) as any;
  const proChatStyle = useProChatSurfaceStyle();
  const chatIdRef = useRef(null);
  const firstChatCompleted = async () => {
    await context.getData();
    nav({ to: `/ollama/${chatIdRef.current}` });
  };

  useEffect(() => {
    return () => {
      chatIdRef.current = null;
    };
  }, []);

  return (
    <>
      <ProChat
        className="min-h-0 flex-1"
        style={proChatStyle}
        request={async (chats) => {
          const messages = chats.map((chat) => ({
            id: chatIdRef.current || "",
            role: chat.role,
            content: chat.content,
          }));
          if (!oc.model_name) {
            return message.error("请先选择模型");
          }
          const response = await getResponse(oc.model_name, { messages });
          return new Response(genResponseStream(response.clone(), chatIdRef, firstChatCompleted));
        }}
      />
    </>
  );
}
