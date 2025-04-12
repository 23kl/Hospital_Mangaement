"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosConfig"
import { AuthContext } from "../context/AuthContext"
import { Clock, DollarSign, Star, Award, Mail, ArrowLeft } from "react-feather"
import Button from "../components/ui/Button"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Alert from "../components/ui/Alert"
import { Card, CardContent } from "../components/ui/Card"
import Badge from "../components/ui/Badge"

const DoctorDetailsPage = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(`/doctors/${id}`)
        setDoctor(res.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctor details")
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="py-8">
        <Alert type="error" message={error} onClose={() => setError(null)} />
        <div className="mt-4">
          <Link to="/doctors" className="text-primary hover:text-primary/80">
            &larr; Back to Doctors
          </Link>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="py-8">
        <Alert type="error" message="Doctor not found" onClose={() => navigate("/doctors")} />
        <div className="mt-4">
          <Link to="/doctors" className="text-primary hover:text-primary/80">
            &larr; Back to Doctors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/doctors" className="inline-flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Doctors
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold mr-6 mb-4 md:mb-0">
              {doctor.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-primary font-medium">{doctor.specialization}</p>
              <div className="flex items-center mt-2 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4" />
                <span className="ml-1 text-gray-600 text-sm">(4.0)</span>
              </div>
            </div>

            <div className="md:ml-auto mt-4 md:mt-0">
              {user && user.role === "patient" ? (
                <Link to={`/patient/book-appointment/${doctor._id}`}>
                  <Button>Book Appointment</Button>
                </Link>
              ) : !user ? (
                <Link to="/login">
                  <Button>Login to Book</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About Dr. {doctor.name.split(" ")[0]}</h2>
                <p className="text-gray-600">
                  {doctor.description ||
                    `Dr. ${doctor.name} is a highly skilled ${doctor.specialization} with ${doctor.experience} years of experience in the field. They are dedicated to providing exceptional care to all patients.`}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">{doctor.specialization}</Badge>
                  {/* Additional specializations could be added here */}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Education & Experience</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Professional Experience</h3>
                      <p className="text-gray-600">
                        {doctor.experience} years of experience as {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  {/* Additional education details could be added here */}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Doctor Information</h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Consultation Fee</h4>
                        <p>₹{doctor.fee}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                        <p>{doctor.experience} years</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p>{doctor.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Available Slots</h3>
                    {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                      <div className="space-y-3">
                        {doctor.availableSlots.map((slot, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <p className="font-medium">{slot.day}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {slot.slots.map((time, timeIndex) => (
                                <span key={timeIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {time.startTime} - {time.endTime}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No availability information provided.</p>
                    )}
                  </div>

                  <div className="mt-6">
                    {user && user.role === "patient" ? (
                      <Link to={`/patient/book-appointment/${doctor._id}`} className="w-full">
                        <Button className="w-full">Book Appointment</Button>
                      </Link>
                    ) : !user ? (
                      <Link to="/login" className="w-full">
                        <Button className="w-full">Login to Book</Button>
                      </Link>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailsPage
