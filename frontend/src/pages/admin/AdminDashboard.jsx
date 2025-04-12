"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { AuthContext } from "../../context/AuthContext"
import { Users, Calendar, CheckSquare, XSquare, ArrowRight } from "react-feather"
import { Card, CardContent } from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)

  const [stats, setStats] = useState({
    appointments: {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    },
    doctors: 0,
    patients: 0,
  })

  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch statistics
        const statsRes = await axiosInstance.get("/admin/statistics")
        setStats(statsRes.data)

        // Fetch recent appointments
        const appointmentsRes = await axiosInstance.get("/admin/appointments")
        setRecentAppointments(appointmentsRes.data.slice(0, 5))

        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of the hospital management system</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <h3 className="text-2xl font-bold">{stats.appointments.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold">{stats.appointments.completed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctors</p>
                <h3 className="text-2xl font-bold">{stats.doctors}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Patients</p>
                <h3 className="text-2xl font-bold">{stats.patients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Status */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Appointment Status</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full mb-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-xl font-bold">{stats.appointments.pending}</h3>
            </div>

            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full mb-2">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <h3 className="text-xl font-bold">{stats.appointments.confirmed}</h3>
            </div>

            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full mb-2">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Completed</p>
              <h3 className="text-xl font-bold">{stats.appointments.completed}</h3>
            </div>

            <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
              <div className="p-2 bg-red-100 rounded-full mb-2">
                <XSquare className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <h3 className="text-xl font-bold">{stats.appointments.cancelled}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Appointments</h2>
          <Link to="/admin/appointments" className="text-primary hover:text-primary/80 flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientId.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.doctorId.userId.name}</div>
                      <div className="text-sm text-gray-500">{appointment.doctorId.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "confirmed"
                              ? "bg-primary/10 text-primary"
                              : appointment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/doctors">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Doctors</h3>
                  <p className="text-sm text-gray-500">View and manage doctor profiles</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/patients">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Patients</h3>
                  <p className="text-sm text-gray-500">View patient information</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/appointments">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">All Appointments</h3>
                  <p className="text-sm text-gray-500">View and manage appointments</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
