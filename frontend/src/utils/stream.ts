export function genResponseStream(response: any, chatIdRef , cb?: (...args) => any) {
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
              cb?.()
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
                 
                  if (!chatIdRef.current)  chatIdRef.current = parsedData.id;
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
