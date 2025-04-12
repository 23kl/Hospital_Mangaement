"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { AuthContext } from "../../context/AuthContext"
import { NotificationContext } from "../../context/NotificationContext"
import { Calendar, Clock, User, Bell, ArrowRight } from "react-feather"
import Button from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import AppointmentCard from "../../components/appointments/AppointmentCard"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"

const PatientDashboard = () => {
  const { user } = useContext(AuthContext)
  const { unreadCount } = useContext(NotificationContext)

  const [appointments, setAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get("/appointments")
        setAppointments(res.data)

        // Filter upcoming appointments (status: confirmed, date >= today)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const upcoming = res.data.filter((app) => app.status === "confirmed" && new Date(app.date) >= today)

        setUpcomingAppointments(upcoming)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch appointments")
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Manage your appointments and health information</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <h3 className="text-2xl font-bold">{appointments.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Appointments</p>
                <h3 className="text-2xl font-bold">{upcomingAppointments.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-4">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unread Notifications</p>
                <h3 className="text-2xl font-bold">{unreadCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-primary hover:text-primary/80 flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
              <p className="text-gray-600 mb-4">You don't have any confirmed appointments scheduled.</p>
              <Link to="/doctors">
                <Button>Find a Doctor</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAppointments.slice(0, 2).map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} userRole="patient" />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/doctors">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Find a Doctor</h3>
                  <p className="text-sm text-gray-500">Browse specialists</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/patient/appointments">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">My Appointments</h3>
                  <p className="text-sm text-gray-500">View all appointments</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/notifications">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-gray-500">
                    {unreadCount > 0 ? `${unreadCount} unread messages` : "No new notifications"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
