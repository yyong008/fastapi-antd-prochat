import axios from "axios";

const request = axios.create({
  baseURL: 'http://localhost:7788',
})


request.interceptors.request.use(config => {
  return config
})

request.interceptors.response.use(config => {
  return config
})

export default request
