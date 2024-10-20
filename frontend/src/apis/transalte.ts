import request from "../utils/request";

export const createTranslate = async (data: any) => {
  try {
    const res = await request.post("/api/translate/", data);
    return res;
  } catch (error) {
    console.error(error);

    return { error: error };
  }
};
