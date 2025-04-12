"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import { Plus, Trash2 } from "react-feather"
import Button from "../../components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import Alert from "../../components/ui/Alert"

const ManageAvailability = () => {
  const { user } = useContext(AuthContext)

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [availableSlots, setAvailableSlots] = useState([])

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ]

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
  
        const doctorRes = await axios.get(`/api/doctors?userId=${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}` // Or use localStorage.getItem('token')
          }
        });
  
        if (doctorRes.data && doctorRes.data.length > 0) {
          const doctorData = doctorRes.data[0];
          setDoctor(doctorData);
  
          if (doctorData.availableSlots && doctorData.availableSlots.length > 0) {
            setAvailableSlots(doctorData.availableSlots);
          } else {
            setAvailableSlots(
              daysOfWeek.map((day) => ({
                day,
                slots: [],
              }))
            );
          }
        }
  
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctor profile");
        setLoading(false);
      }
    };
  
    if (user && user.role === "doctor") {
      fetchDoctorProfile();
    }
  }, [user]);
  

  const handleAddTimeSlot = (dayIndex) => {
    const updatedSlots = [...availableSlots]

    // If this day doesn't exist yet, create it
    if (!updatedSlots[dayIndex]) {
      updatedSlots[dayIndex] = {
        day: daysOfWeek[dayIndex],
        slots: [],
      }
    }

    // Add a new empty time slot
    updatedSlots[dayIndex].slots.push({
      startTime: "09:00 AM",
      endTime: "09:30 AM",
    })

    setAvailableSlots(updatedSlots)
  }

  const handleRemoveTimeSlot = (dayIndex, slotIndex) => {
    const updatedSlots = [...availableSlots]
    updatedSlots[dayIndex].slots.splice(slotIndex, 1)
    setAvailableSlots(updatedSlots)
  }

  const handleTimeChange = (dayIndex, slotIndex, field, value) => {
    const updatedSlots = [...availableSlots]

    // Update the specified field (startTime or endTime)
    updatedSlots[dayIndex].slots[slotIndex][field] = value

    // If changing startTime, automatically update endTime to be 30 minutes later
    if (field === "startTime") {
      const startTimeIndex = timeSlots.findIndex((time) => time === value)
      if (startTimeIndex !== -1 && startTimeIndex < timeSlots.length - 1) {
        updatedSlots[dayIndex].slots[slotIndex].endTime = timeSlots[startTimeIndex + 1]
      }
    }

    setAvailableSlots(updatedSlots)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      setSubmitting(true);
  
      // Filter out days with no slots
      const filteredSlots = availableSlots.filter((day) => day.slots.length > 0);
  
      await axios.put(
        `/api/doctors/${doctor._id}/availability`,
        {
          availableSlots: filteredSlots,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Add token here
          },
        }
      );
  
      setSuccess("Availability updated successfully");
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update availability");
      setSubmitting(false);
    }
  };
  

  if (loading) return <LoadingSpinner />

  if (!doctor) {
    return (
      <div className="py-8">
        <Alert type="error" message="Doctor profile not found" />
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600">Set your available time slots for appointments</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-6" />}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {daysOfWeek.map((day, dayIndex) => (
                <div key={day} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{day}</h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddTimeSlot(dayIndex)}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>

                  {availableSlots[dayIndex]?.slots.length === 0 ? (
                    <p className="text-gray-500 text-sm">No time slots added for {day}</p>
                  ) : (
                    <div className="space-y-2">
                      {availableSlots[dayIndex]?.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-2">
                          <select
                            value={slot.startTime}
                            onChange={(e) => handleTimeChange(dayIndex, slotIndex, "startTime", e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <span>to</span>
                          <select
                            value={slot.endTime}
                            onChange={(e) => handleTimeChange(dayIndex, slotIndex, "endTime", e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Availability"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ManageAvailability
