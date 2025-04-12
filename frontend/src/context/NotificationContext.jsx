"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axiosInstance from "../utils/axiosConfig"
import { AuthContext } from "./AuthContext"

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useContext(AuthContext)

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [user])

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/notifications")
      setNotifications(res.data)

      // Count unread notifications
      const unread = res.data.filter((notification) => !notification.isRead).length
      setUnreadCount(unread)

      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Failed to fetch notifications")
    }
  }

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await axiosInstance.put(`/notifications/${id}`)

      // Update notifications state
      setNotifications(
        notifications.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification,
        ),
      )

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1))

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark notification as read")
      throw err
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/notifications")

      // Update notifications state
      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))

      // Reset unread count
      setUnreadCount(0)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark all notifications as read")
      throw err
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearError,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
