"use client"

import { createContext, useState, useEffect } from "react"
import axiosInstance from "../utils/axiosConfig"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
      // Set axios default header
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await axiosInstance.post("/auth/register", userData)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data))

        // Set axios default header
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

        setUser(res.data)
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Something went wrong")
      throw err
    }
  }

  // Register doctor
  const registerDoctor = async (doctorData) => {
    try {
      setLoading(true)
      const res = await axiosInstance.post("/auth/register-doctor", doctorData)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data))

        // Set axios default header
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

        setUser(res.data)
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Something went wrong")
      throw err
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await axiosInstance.post("/auth/login", { email, password })

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data))

        // Set axios default header
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

        setUser(res.data)
      }

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Invalid email or password")
      throw err
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axiosInstance.defaults.headers.common["Authorization"]
    setUser(null)
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        registerDoctor,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
