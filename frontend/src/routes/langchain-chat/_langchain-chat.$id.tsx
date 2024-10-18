import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { getChatById, getResponseUpdate } from "../../apis/langchain-chat";
import { useEffect, useRef, useState } from "react";

import { ProChat } from "@ant-design/pro-chat";
import { genResponseStream } from "../../utils/stream";
import { message } from "antd";
import { useTheme } from "antd-style";

export const Route = createFileRoute('/langchain-chat/_langchain-chat/$id')({
  component:  ChatComponent
})


function ChatComponent() {
  const { id } = useParams({ strict: false });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const chatIdRef = useRef(null);
  const nav = useNavigate()

  const [initialChats, setInitialChats] = useState([]);

  const getData = async () => {
    setLoading(true);

    const res: any = await getChatById(id);
    
    if(res && res.error) {
      message.error(res.error.response.data.detail, 1, () => {
        nav({to: "/langchain-chat"})
      });
      return
    }

    const chs = JSON.parse(res?.data.chat || "[]").map(
      (item, index) => {
        if(!chatIdRef.current) chatIdRef.current = item.id;
        return {
          id: index + item.id,
          role: item.role,
          content: item.content,
        };
      }
    );
    setInitialChats(chs);
    setLoading(false);
  };
  useEffect(() => {
    getData();
    return () => {
      chatIdRef.current = null;
      setInitialChats([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (initialChats.length === 0) return null;
  return (
    <>
      <ProChat
        loading={loading}
        style={{
          background: theme.colorBgLayout,
        }}
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
    </>
  );
}


