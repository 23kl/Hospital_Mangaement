"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { NotificationContext } from "../../context/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { Check } from "react-feather"
import Badge from "../ui/Badge"

const NotificationItem = ({ notification }) => {
  const { markAsRead } = useContext(NotificationContext)

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markAsRead(notification._id)
    }
  }

  const getNotificationLink = () => {
    if (notification.regarding.includes("appointment") && notification.appointmentId) {
      return `/patient/appointments/${notification.appointmentId}`
    }
    return "#"
  }

  const getNotificationBadge = () => {
    if (notification.regarding.includes("confirmation")) {
      return <Badge variant="primary">Confirmation</Badge>
    } else if (notification.regarding.includes("cancellation")) {
      return <Badge variant="danger">Cancellation</Badge>
    } else if (notification.regarding.includes("reminder")) {
      return <Badge variant="warning">Reminder</Badge>
    } else {
      return <Badge>General</Badge>
    }
  }

  return (
    <div className={`p-4 border-b border-gray-200 ${!notification.isRead ? "bg-blue-50" : ""}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium">{notification.title}</h3>
            {getNotificationBadge()}
          </div>
          <p className="text-gray-600 mb-2">{notification.message}</p>
          <div className="flex items-center text-xs text-gray-500">
            <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          {notification.appointmentId && (
            <Link to={getNotificationLink()} className="text-sm text-primary hover:text-primary/80">
              View Details
            </Link>
          )}

          {!notification.isRead && (
            <button onClick={handleMarkAsRead} className="flex items-center text-xs text-primary hover:text-primary/80">
              <Check className="h-3 w-3 mr-1" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
