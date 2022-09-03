import BASE_URL from './url.js'
import axios from 'axios'
import { getToken, removeToken } from './auth.js'

const API = axios.create({
  baseURL: BASE_URL,
})

//添加请求拦截器
API.interceptors.request.use((config) => {
  // console.log(config, config.url)
  const { url } = config
  //判断url是不是以/user并且不是以/user/login和/user/registered开头
  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    //添加请求头
    config.headers.Authorization = getToken()
  }
  return config
})

//添加响应拦截器
API.interceptors.response.use((response) => {
  const { states } = response.data
  // console.log(response)
  if (states === 400) {
    //说明token失效,可以移除token
    removeToken()
  }
  return response
})
export { API }
