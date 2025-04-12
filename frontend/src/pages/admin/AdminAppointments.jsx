"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosConfig"
import { Calendar, Filter, Search } from "react-feather"
import { format } from "date-fns"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"
import Badge from "../../components/ui/Badge"

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get("/admin/appointments")
        setAppointments(res.data)
        setFilteredAppointments(res.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch appointments")
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = appointments

    // Apply status filter
    if (filter !== "all") {
      result = result.filter((appointment) => appointment.status === filter)
    }

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (appointment) =>
          appointment.patientId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorId.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.issue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredAppointments(result)
  }, [filter, searchTerm, appointments])

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

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/appointments/${id}`, { status })

      // Update local state
      setAppointments(appointments.map((app) => (app._id === id ? { ...app, status } : app)))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment status")
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
          <p className="text-gray-600">Manage all appointments in the system</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient, doctor or issue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "pending" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "confirmed" ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "completed" ? "bg-green-500 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "cancelled" ? "bg-red-500 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No appointments found</h2>
          <p className="text-gray-600 mb-6">
            {filter === "all" ? "There are no appointments in the system yet." : `No ${filter} appointments found.`}
          </p>
        </div>
      ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientId.name}</div>
                      <div className="text-sm text-gray-500">{appointment.patientId.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.doctorId.userId.name}</div>
                      <div className="text-sm text-gray-500">{appointment.doctorId.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{format(new Date(appointment.date), "MMMM d, yyyy")}</div>
                      <div className="text-sm text-gray-500">
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(appointment.status)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{appointment.issue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {appointment.status === "pending" && (
                          <>
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
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleUpdateStatus(appointment._id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAppointments
