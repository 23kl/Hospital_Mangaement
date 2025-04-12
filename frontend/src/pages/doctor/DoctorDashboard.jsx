"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { AuthContext } from "../../context/AuthContext"
import { NotificationContext } from "../../context/NotificationContext"
import { Calendar, Clock, Bell, ArrowRight, CheckSquare, XSquare } from "react-feather"
import Button from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"
import Badge from "../../components/ui/Badge"
import { format } from "date-fns"

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext)
  const { unreadCount } = useContext(NotificationContext)

  const [appointments, setAppointments] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get("/appointments")
        setAppointments(res.data)

        // Calculate stats
        const total = res.data.length
        const pending = res.data.filter((app) => app.status === "pending").length
        const confirmed = res.data.filter((app) => app.status === "confirmed").length
        const completed = res.data.filter((app) => app.status === "completed").length
        const cancelled = res.data.filter((app) => app.status === "cancelled").length

        setStats({ total, pending, confirmed, completed, cancelled })

        // Filter today's appointments
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todayApps = res.data.filter(
          (app) => new Date(app.date) >= today && new Date(app.date) < tomorrow && app.status === "confirmed",
        )

        setTodayAppointments(todayApps)

        // Filter pending appointments
        const pendingApps = res.data.filter((app) => app.status === "pending")
        setPendingAppointments(pendingApps)

        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch appointments")
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/appointments/${id}`, { status })

      // Update local state
      setAppointments(appointments.map((app) => (app._id === id ? { ...app, status } : app)))

      // Update pending appointments
      setPendingAppointments(pendingAppointments.filter((app) => app._id !== id))

      // Update stats
      setStats({
        ...stats,
        pending: status === "pending" ? stats.pending : stats.pending - 1,
        confirmed: status === "confirmed" ? stats.confirmed + 1 : stats.confirmed,
        cancelled: status === "cancelled" ? stats.cancelled + 1 : stats.cancelled,
      })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment status")
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name.split(" ")[0]}</h1>
        <p className="text-gray-600">Manage your appointments and patient information</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <h3 className="text-xl font-bold">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-4">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <h3 className="text-xl font-bold">{stats.pending}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Confirmed</p>
                <h3 className="text-xl font-bold">{stats.confirmed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <h3 className="text-xl font-bold">{stats.completed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-4">
                <XSquare className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cancelled</p>
                <h3 className="text-xl font-bold">{stats.cancelled}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today's Appointments</h2>
          <Link to="/doctor/appointments" className="text-primary hover:text-primary/80 flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No appointments today</h3>
              <p className="text-gray-600">You don't have any confirmed appointments for today.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{appointment.patientId.name}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 text-sm">
                        <span className="font-medium">Issue:</span> {appointment.issue}
                      </p>
                    </div>
                    <Link to={`/doctor/appointments/${appointment._id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Appointment Requests */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pending Appointment Requests</h2>
          <Link to="/doctor/appointments" className="text-primary hover:text-primary/80 flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {pendingAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending requests</h3>
              <p className="text-gray-600">You don't have any pending appointment requests.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold mr-2">{appointment.patientId.name}</h3>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 text-sm">
                        <span className="font-medium">Issue:</span> {appointment.issue}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(appointment._id, "confirmed")}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
