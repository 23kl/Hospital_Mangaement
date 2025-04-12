"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { Calendar, Filter } from "react-feather"
import AppointmentCard from "../../components/appointments/AppointmentCard"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

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
    if (filter === "all") {
      setFilteredAppointments(appointments)
    } else {
      setFilteredAppointments(appointments.filter((appointment) => appointment.status === filter))
    }
  }, [filter, appointments])

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">View and manage all your appointments</p>
        </div>

        <div className="mt-4 md:mt-0">
          <Link to="/doctors">
            <Button>Book New Appointment</Button>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-2">
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

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No appointments found</h2>
          <p className="text-gray-600 mb-6">
            {filter === "all" ? "You don't have any appointments yet." : `You don't have any ${filter} appointments.`}
          </p>
          <Link to="/doctors">
            <Button>Book an Appointment</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment} userRole="patient" />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
