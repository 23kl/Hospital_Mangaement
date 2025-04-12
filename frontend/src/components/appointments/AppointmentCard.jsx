import { Link } from "react-router-dom"
import { Calendar, Clock, User } from "react-feather"
import { format } from "date-fns"
import Badge from "../ui/Badge"

const AppointmentCard = ({ appointment, userRole }) => {
  const getStatusBadge = () => {
    switch (appointment.status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>
      case "confirmed":
        return <Badge variant="primary">Confirmed</Badge>
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>
      case "completed":
        return <Badge variant="success">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy")
  }

  return (
    <Link to={`/${userRole}/appointments/${appointment._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-2">
                  {userRole === "doctor" ? appointment.patientId.name : appointment.doctorId.userId.name}
                </h3>
                {getStatusBadge()}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                  </span>
                </div>
                {userRole === "doctor" && (
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{appointment.patientId.name}</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-gray-600 text-sm line-clamp-2">
                  <span className="font-medium">Issue:</span> {appointment.issue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AppointmentCard
