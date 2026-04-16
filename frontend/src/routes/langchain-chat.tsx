import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ChatSide } from "../components/ChatSideLangChain";
import { Layout } from "antd";
import { useTheme } from "antd-style";
import { chatContext } from "../context/index";
import { getChats } from "../apis/chat";

const { Sider, Content } = Layout;

export const Route = createFileRoute("/langchain-chat")({
  component: ChatComponent,
});

function ChatComponent() {
  const theme = useTheme();
  const chatIdRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    setIsLoading(true);
    const res: any = await getChats();
    if (res && res.code === 0) {
      setChats(res.data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    return () => {
      chatIdRef.current = null;
    };
  }, []);

  return (
    <chatContext.Provider value={{ chats: chats, setChats: setChats, getData: getData }}>
      <Layout className="min-h-dvh">
        <div className="flex h-dvh w-full min-h-0 flex-nowrap overflow-hidden">
          <Sider width={220} className="overflow-y-auto" style={{ background: theme.colorBgContainer }}>
            <ChatSide isLoading={isLoading} />
          </Sider>
          <Content
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            style={{ background: theme.colorBgLayout, margin: 0 }}
          >
            <Outlet />
          </Content>
        </div>
      </Layout>
    </chatContext.Provider>
  );
}
