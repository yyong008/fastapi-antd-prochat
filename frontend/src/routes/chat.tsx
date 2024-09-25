import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ChatSide } from "../components/ChatSide";
import { Layout } from "antd";
import { chatContext } from "../context/index";
import { getChats } from "../apis/chat";

const { Sider, Content } = Layout;

export const Route = createFileRoute("/chat")({
  component: ChatComponent,
});

function ChatComponent() {
  const chatIdRef = useRef(null);
  const [chats, setChats] = useState([]);
  const getData = async () => {
    const res: any = await getChats();
    if (res && res.code === 0) {
      setChats(res.data);
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
      <Layout>
        <div className="w-[100%] h-[100vh] flex no-wrap">
          <Sider>
            <ChatSide />
          </Sider>
          <Content>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </chatContext.Provider>
  );
}
