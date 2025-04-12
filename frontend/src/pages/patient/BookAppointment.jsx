import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosConfig"
import { AuthContext } from "../../context/AuthContext"
import { Calendar, Clock, ArrowLeft } from "react-feather"
import { format, addDays, isSameDay } from "date-fns"
import Button from "../../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"

const BookAppointment = () => {
  const { doctorId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [issue, setIssue] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  // Available time slots (this would normally come from the doctor's availability)
  const defaultTimeSlots = [
    { startTime: "09:00 AM", endTime: "09:30 AM" },
    { startTime: "09:30 AM", endTime: "10:00 AM" },
    { startTime: "10:00 AM", endTime: "10:30 AM" },
    { startTime: "10:30 AM", endTime: "11:00 AM" },
    { startTime: "11:00 AM", endTime: "11:30 AM" },
    { startTime: "11:30 AM", endTime: "12:00 PM" },
    { startTime: "02:00 PM", endTime: "02:30 PM" },
    { startTime: "02:30 PM", endTime: "03:00 PM" },
    { startTime: "03:00 PM", endTime: "03:30 PM" },
    { startTime: "03:30 PM", endTime: "04:00 PM" },
    { startTime: "04:00 PM", endTime: "04:30 PM" },
    { startTime: "04:30 PM", endTime: "05:00 PM" },
  ]

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        // Use axiosInstance instead of axios directly
        const res = await axiosInstance.get(`/doctors/${doctorId}`)
        setDoctor(res.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctor details")
        setLoading(false)
      }
    }

    if (doctorId) {
      fetchDoctor()
    }
  }, [doctorId])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedTimeSlot || !issue.trim()) {
      setError("Please select a time slot and describe your issue")
      return
    }

    try {
      setSubmitting(true)

      const appointmentData = {
        doctorId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        issue,
      }

      await axiosInstance.post("/appointments", appointmentData)

      setSuccess("Appointment request submitted successfully!")
      setSubmitting(false)

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/patient/appointments")
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment")
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

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
        <Link to={`/doctors/${doctorId}`} className="inline-flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Doctor Profile
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      {success && <Alert type="success" message={success} className="mb-6" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctor Info */}
        <Card>
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

            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>{doctor.experience} years experience</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span>₹{doctor.fee} consultation fee</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <div className="flex overflow-x-auto pb-2 space-x-2">
                    {dates.map((date, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        className={`flex flex-col items-center p-3 rounded-md min-w-[80px] ${
                          isSameDay(selectedDate, date) ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <span className="text-xs font-medium">{format(date, "EEE")}</span>
                        <span className="text-lg font-bold">{format(date, "d")}</span>
                        <span className="text-xs">{format(date, "MMM")}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {defaultTimeSlots.map((timeSlot, index) => {
                      const isSelected =
                        selectedTimeSlot &&
                        selectedTimeSlot.startTime === timeSlot.startTime &&
                        selectedTimeSlot.endTime === timeSlot.endTime

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                          className={`p-2 text-sm rounded-md border text-center ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          {timeSlot.startTime}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mb-6">
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your issue
                  </label>
                  <textarea
                    id="issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Please describe your symptoms or reason for visit..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting || !selectedTimeSlot || !issue.trim()}>
                    {submitting ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
