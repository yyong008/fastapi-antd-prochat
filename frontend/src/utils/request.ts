import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:7788",
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (config) => {
    return config.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
