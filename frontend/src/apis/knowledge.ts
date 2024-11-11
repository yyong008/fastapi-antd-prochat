import request from "../utils/request";

export const getKnowledges = async () => {
  try {
    const res = await request.get("/api/knowledge");
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getKnowledgeById = async (id) => {
  try {
    const res = await request.get(`/api/knowledge/${id}`);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export const createKnowledge = async (data) => {
  try {
    const res = await request.post("/api/knowledge", data);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export const deleteKnowledge = async (id) => {
  try {
    const res = await request.delete(`/api/knowledge/${id}`);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export const addFileToKnowledge = async (id, data) => {
  try {
    const res = await request.post(`/api/knowledge/${id}/file/add`, data);
    return res;
  } catch (error) {
    console.error(error);
  }
}
