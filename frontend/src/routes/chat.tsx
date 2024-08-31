import { ProChat } from "@ant-design/pro-chat";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "antd-style";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

function Chat() {
  const theme = useTheme();
  const [value, setValue] = useState();

  const getResponse = async (data: any) => {
    const response = await fetch("http://localhost:7788/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "99vw",
        boxSizing: "border-box",
      }}
    >
      <div>
        <ProChat
          style={{
            width: "500px",
            height: "90vh",
            background: theme.colorBgLayout,
          }}
          // initialChats={initialChats}
          locale="en-US"
          inputAreaProps={{
            value: value,
            onChange: (e: any) => {
              setValue(e);
            },
          }}
          request={async (chat) => {
            const currentContent = chat[chat.length - 1].content;
            const response = await getResponse({ content: currentContent });

            return new Response(genResponseStream(response.clone()));
          }}
        />
      </div>
    </div>
  );
}

function genResponseStream(response: any) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      try {
        (async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            // 解码并累积数据块
            let result = decoder.decode(value, { stream: true });

            // 处理 SSE 数据块
            const events = result.split("\n\n"); // 假设每个事件块以 '\n\n' 结束
            result = events.pop() || ""; // 留下未处理的部分

            events.forEach((event) => {
              if (event.startsWith("data: ")) {
                const data = event.substring(6).trim();
                // 解析 JSON 数据
                try {
                  const parsedData = JSON.parse(data);
                  controller.enqueue(encoder.encode(parsedData.content)); // 将内容写入流
                } catch (e) {
                  controller.close();
                  console.error("Error parsing JSON:", e);
                }
              }
            });
          }
        })();
      } catch (error) {
        controller.close();
        console.log(error);
      }
    },
  });
}
