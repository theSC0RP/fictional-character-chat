import axios from 'axios'
import { API_BASE, AUTH_API_PREFIX } from '../constants'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // to send cookies
})
const nonRetryableRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/refresh-access-token"
]
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldSkipRetry = nonRetryableRoutes.some(path =>
      originalRequest.url?.includes(path)
    )

    if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRetry) {
      originalRequest._retry = true
      try {
        await axios.post(`${API_BASE}${AUTH_API_PREFIX}/refresh-access-token`, {}, { withCredentials: true })
        return axiosInstance(originalRequest) // retry original request
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
