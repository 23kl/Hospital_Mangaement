"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { Calendar, Filter, Search } from "react-feather"
import { format } from "date-fns"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"
import Badge from "../../components/ui/Badge"

const DoctorAppointments = () => {
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
        const res = await axiosInstance.get("/appointments")
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
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage all your patient appointments</p>
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
            placeholder="Search by patient name or issue"
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

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No appointments found</h2>
          <p className="text-gray-600 mb-6">
            {filter === "all" ? "You don't have any appointments yet." : `You don't have any ${filter} appointments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold mr-2">{appointment.patientId.name}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
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
                    <Link to={`/doctor/appointments/${appointment._id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>

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
                          Decline
                        </Button>
                      </>
                    )}

                    {appointment.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleUpdateStatus(appointment._id, "completed")}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments
