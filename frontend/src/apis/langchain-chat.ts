import request from "../utils/request";

export const getResponse = async (data: any) => {
  const response = await fetch("http://localhost:7788/api/langchain-chat/chat", {
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

export const getResponseUpdate = async (id, data: any) => {
  const response = await fetch("http://localhost:7788/api/langchain-chat/chat/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response && !response.ok) {
    throw new Error("Network response was not ok");
  }
  return response;
};

export const getChats = async () => {
  try {
    const res = await request.get("/api/chats");
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getChatById = async (id: string) => {
  try {
    const res = await request.get("/api/chat/" + id);
    return res;
  } catch (error) {
    console.error(error);

    return { error: error };
  }
};

export const deleteChatById = async (id: string) => {
  try {
    const res = await request.delete("/api/chat/" + id);
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updateTitleById = async (id: string, title) => {
  try {
    const res = await request.put("/api/chat/" + id +"/title", { title: title });
    return res;
  } catch (error) {
    console.error(error);
  }
};
