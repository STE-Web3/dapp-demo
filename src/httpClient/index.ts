import { sendError } from '@/utils/monitor'
import axiosHttp from './axios'

export default {
  async request(options: any) {
    const startTime = Date.now()
    const t = setTimeout(() => {
      sendError('unresponsiveRequests', {
        options,
        totalTime: Date.now() - startTime,
      })
    }, 1000 * 10)
    try {
      const data = await axiosHttp.request(options)
      const totalTime = Date.now() - startTime
      if (totalTime > 1000) {
        sendError('slowRequests', {
          options,
          totalTime: Date.now() - startTime,
        })
      }
      sendError('request', {
        options,
        data,
      })

      clearTimeout(t)
      return data
    } catch (error) {
      clearTimeout(t)
      return Promise.reject(error)
    }
  },
}
