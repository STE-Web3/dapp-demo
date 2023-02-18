/**
 * 网络请求配置
 */
import i18n from '@/i18n/i18n'
import axios from 'axios'
import { Toast } from 'react-vant'

const timeout = 100000
const baseURL = import.meta.env.VITE_API_DOMAIN

/**
 * 创建 axios 请求实例
 * 注意：get 请求需要传 params，post 请求需要传 data。
 * @see https://axios-http.com/docs/api_intro
 */
const axiosHttp = axios.create({
  baseURL: baseURL, // 基础请求地址
  timeout: timeout, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
})

/**
 * http request 拦截器
 */
axiosHttp.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json',
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * http response 拦截器
 */
axiosHttp.interceptors.response.use(
  (response) => {
    // console.log('response is ', response)
    if (response.data.retCode === 0) {
      return response.data.result
    } else {
      // Toast.fail({
      //   message: '服务器开了一点点小差！',
      //   position: 'top',
      // })
      console.log('response.data.retCode ==', response.data.retCode)
      return Promise.reject(response.data)
    }
  },
  (error) => {
    Toast.fail({
      message: i18n.t('server.error') || '',
      position: 'top',
    })
    console.log('请求出错：', error)
    return Promise.reject(error)
  }
)

export default axiosHttp
