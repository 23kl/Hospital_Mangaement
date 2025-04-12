"use client"

import { useContext, useEffect } from "react"
import { NotificationContext } from "../context/NotificationContext"
import NotificationItem from "../components/notifications/NotificationItem"
import Button from "../components/ui/Button"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Alert from "../components/ui/Alert"
import { Bell, Check } from "react-feather"

const NotificationsPage = () => {
  const { notifications, loading, error, fetchNotifications, markAllAsRead, clearError } =
    useContext(NotificationContext)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={clearError} />}

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
          <p className="text-gray-600">
            You don't have any notifications at the moment. We'll notify you when there are updates.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
