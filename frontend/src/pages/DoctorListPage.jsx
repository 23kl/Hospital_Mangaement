"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosConfig"
import { Search, Filter } from "react-feather"
import DoctorCard from "../components/doctors/DoctorCard"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Alert from "../components/ui/Alert"

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    specialization: "",
  })

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get("/doctors")
        setDoctors(res.data)
        setFilteredDoctors(res.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctors")
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = doctors

    // Apply specialization filter
    if (filters.specialization) {
      result = result.filter((doctor) =>
        doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase()),
      )
    }

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredDoctors(result)
  }, [searchTerm, filters, doctors])

  // Get unique specializations for filter
  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))]

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
        <p className="text-gray-600">
          Browse our network of qualified healthcare professionals and book an appointment.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or specialization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="md:w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>

            <select
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorListPage
