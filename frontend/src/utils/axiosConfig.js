import axios from "axios"

// 1. Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "/api", // uses Vite proxy
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 2. Request interceptor: adds token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Always get the fresh token from localStorage for each request
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 3. Response interceptor: handles API errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default axiosInstance
