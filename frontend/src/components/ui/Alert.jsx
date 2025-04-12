"use client"
import { AlertCircle, CheckCircle, Info, X } from "react-feather"

const Alert = ({ type = "info", message, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        }
      case "error":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        }
      case "warning":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        }
      case "info":
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: <Info className="h-5 w-5 text-blue-500" />,
        }
    }
  }

  const { bg, text, icon } = getAlertStyles()

  return (
    <div className={`${bg} ${text} p-4 rounded-md mb-4 flex items-start`}>
      <div className="flex-shrink-0 mr-3">{icon}</div>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
