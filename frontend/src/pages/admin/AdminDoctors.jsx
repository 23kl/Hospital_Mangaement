"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosConfig"
import { Search, User, Mail, Phone, Briefcase } from "react-feather"
import { Card, CardContent } from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"
import Button from "../../components/ui/Button"

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get("/admin/doctors")

        // Format the doctor data to include user details
        const formattedDoctors = res.data.map((doctor) => ({
          ...doctor,
          name: doctor.userId.name,
          email: doctor.userId.email,
        }))

        setDoctors(formattedDoctors)
        setFilteredDoctors(formattedDoctors)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctors")
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors(doctors)
    }
  }, [searchTerm, doctors])

  if (loading) return <LoadingSpinner />

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-600">View and manage all doctors in the system</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or specialization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Doctors List */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No doctors found</h2>
          <p className="text-gray-600 mb-6">
            {searchTerm ? "No doctors match your search criteria." : "There are no doctors in the system yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor._id}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mr-4">
                    {doctor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p className="text-primary">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{doctor.email}</span>
                  </div>
                  {doctor.userId.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{doctor.userId.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-700">
                    <span className="font-medium">₹{doctor.fee}</span> consultation fee
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDoctors
