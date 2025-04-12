"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { NotificationContext } from "../../context/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check } from "react-feather"

const NotificationDropdown = () => {
  const { notifications, markAsRead, markAllAsRead, loading } = useContext(NotificationContext)

  const handleMarkAsRead = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    markAsRead(id)
  }

  const handleMarkAllAsRead = (e) => {
    e.preventDefault()
    markAllAsRead()
  }

  const getNotificationLink = (notification) => {
    if (notification.regarding.includes("appointment") && notification.appointmentId) {
      return `/patient/appointments/${notification.appointmentId}`
    }
    return "/notifications"
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:text-primary/80">
          Mark all as read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-2 text-center text-sm text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <Bell className="h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <Link
              key={notification._id}
              to={getNotificationLink(notification)}
              className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

              {!notification.isRead && (
                <button
                  onClick={(e) => handleMarkAsRead(e, notification._id)}
                  className="mt-2 flex items-center text-xs text-primary hover:text-primary/80"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark as read
                </button>
              )}
            </Link>
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-200">
        <Link to="/notifications" className="block text-center text-sm text-primary hover:text-primary/80">
          View all notifications
        </Link>
      </div>
    </div>
  )
}

export default NotificationDropdown
