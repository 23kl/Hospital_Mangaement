"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { format } from "date-fns"
import { Calendar, User, FileText, ArrowLeft, X } from "react-feather"
import Button from "../../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"
import Badge from "../../components/ui/Badge"

const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(`/appointments/${id}`)
        setAppointment(res.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch appointment details")
        setLoading(false)
      }
    }

    if (id) {
      fetchAppointment()
    }
  }, [id])

  const handleCancelAppointment = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    try {
      setCancelLoading(true)
      await axiosInstance.put(`/appointments/${id}`, { status: "cancelled" })
      setAppointment({ ...appointment, status: "cancelled" })
      setCancelSuccess(true)
      setCancelLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel appointment")
      setCancelLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
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

  if (loading) return <LoadingSpinner />

  if (!appointment) {
    return (
      <div className="py-8">
        <Alert type="error" message="Appointment not found" onClose={() => navigate("/patient/appointments")} />
        <div className="mt-4">
          <Link to="/patient/appointments" className="text-primary hover:text-primary/80">
            &larr; Back to Appointments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/patient/appointments" className="inline-flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Appointments
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        <div className="mt-2 md:mt-0">{getStatusBadge(appointment.status)}</div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      {cancelSuccess && <Alert type="success" message="Appointment cancelled successfully" className="mb-6" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointment Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                    <p className="font-medium">{format(new Date(appointment.date), "MMMM d, yyyy")}</p>
                    <p>
                      {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                    <p className="font-medium">{appointment.doctorId.userId.name}</p>
                    <p className="text-primary">{appointment.doctorId.specialization}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issue</h3>
                    <p>{appointment.issue}</p>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Doctor's Notes</h3>
                      <p>{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            {appointment.status === "pending" || appointment.status === "confirmed" ? (
              <CardFooter className="bg-gray-50 px-6 py-4">
                <Button
                  variant="danger"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  {cancelLoading ? "Cancelling..." : "Cancel Appointment"}
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        </div>

        {/* Status Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                      1
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h3 className="font-medium">Appointment Requested</h3>
                    <p className="text-sm text-gray-500">{format(new Date(appointment.createdAt), "MMMM d, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                        appointment.status === "confirmed" || appointment.status === "completed"
                          ? "bg-primary text-white"
                          : appointment.status === "cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      2
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {appointment.status === "confirmed" || appointment.status === "completed"
                        ? "Appointment Confirmed"
                        : appointment.status === "cancelled"
                          ? "Appointment Cancelled"
                          : "Awaiting Confirmation"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appointment.status === "pending" ? "Waiting for doctor to confirm" : "Status updated"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                        appointment.status === "completed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {appointment.status === "completed" ? "Appointment Completed" : "Appointment Completion"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appointment.status === "completed"
                        ? "Your appointment has been completed"
                        : "Waiting for appointment date"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetails
