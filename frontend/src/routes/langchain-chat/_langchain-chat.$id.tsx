import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { getChatById, getResponseUpdate } from "../../apis/langchain-chat";
import { useEffect, useRef, useState } from "react";

import { ProChat } from "@ant-design/pro-chat";
import { genResponseStream } from "../../utils/stream";
import { message } from "antd";
import { chatWorkspaceInnerClass, useProChatSurfaceStyle } from "../_sharedUi";

export const Route = createFileRoute("/langchain-chat/_langchain-chat/$id")({
  component: ChatComponent,
});

function ChatComponent() {
  const { id } = useParams({ strict: false });
  const [loading, setLoading] = useState(false);
  const proChatStyle = useProChatSurfaceStyle();
  const chatIdRef = useRef(null);
  const nav = useNavigate();

  const [initialChats, setInitialChats] = useState([]);

  const getData = async () => {
    setLoading(true);

    const res: any = await getChatById(id);

    if (res && res.error) {
      message.error(res.error.response.data.detail, 1, () => {
        nav({ to: "/langchain-chat" });
      });
      return;
    }

    const chs = JSON.parse(res?.data.chat || "[]").map((item, index) => {
      if (!chatIdRef.current) chatIdRef.current = item.id;
      return {
        id: index + item.id,
        role: item.role,
        content: item.content,
      };
    });
    setInitialChats(chs);
    setLoading(false);
  };
  useEffect(() => {
    getData();
    return () => {
      chatIdRef.current = null;
      setInitialChats([]);
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (initialChats.length === 0) return null;
  return (
    <div className={chatWorkspaceInnerClass}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ProChat
          loading={loading}
          className="min-h-0 flex-1"
          style={proChatStyle}
        initialChats={initialChats}
        request={async (chats) => {
          const messages = chats.map((chat) => ({
            id: chatIdRef.current || "",
            role: chat.role,
            content: chat.content,
          }));
          const response = await getResponseUpdate(id, { messages });
          return new Response(genResponseStream(response.clone(), chatIdRef));
        }}
        />
      </div>
    </div>
  );
}
