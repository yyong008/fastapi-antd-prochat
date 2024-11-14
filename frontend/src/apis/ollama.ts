import request from "../utils/request";

export const getResponse = async (model_name: string, data: any) => {
  const response = await fetch(
    "http://localhost:7788/api/ollama-chat/chat?model_name=" + model_name,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response;
};

export const getResponseUpdate = async (id, model_name: string, data: any) => {
  const response = await fetch(
    "http://localhost:7788/api/ollama-chat/chat/" + id + "?model_name=" + model_name,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (response && !response.ok) {
    throw new Error("Network response was not ok");
  }
  return response;
};

export const getOllamaModels = async () => {
  try {
    const res = await request.get("/api/ollama-chat/models");
    return res;
  } catch (error) {
    console.error(error);
  }
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
    const res = await request.put("/api/chat/" + id + "/title", {
      title: title,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
