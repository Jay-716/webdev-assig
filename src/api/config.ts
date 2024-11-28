import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { baseUrl } from '@/config'

export default function request(options: axios.AxiosRequestConfig<any>) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: baseUrl,
      timeout: 10 * 1000,
    })

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config
    })

    instance(options)
      .then(res => {
        resolve(res)
      }).catch(err => {
        const res = err.response
        if (res.status == 401) {
          ElMessage({
            type: 'warning',
            message: '请先登陆'
          })
          router.replace("/login")
        }
        reject(err)
      })
  })
}
