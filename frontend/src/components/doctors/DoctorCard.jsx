import { Link } from "react-router-dom"
import { Star, Clock, DollarSign } from "react-feather"
import Button from "../ui/Button"

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mr-4">
            {doctor.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-primary font-medium">{doctor.specialization}</p>
            <div className="flex items-center mt-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4" />
              <span className="ml-1 text-gray-600 text-sm">(4.0)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>₹{doctor.fee} consultation fee</span>
          </div>
        </div>

        {doctor.description && <p className="mt-4 text-gray-600 text-sm line-clamp-2">{doctor.description}</p>}

        <div className="mt-6 flex justify-between items-center">
          <Link to={`/doctors/${doctor._id}`}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
          <Link to={`/patient/book-appointment/${doctor._id}`}>
            <Button size="sm">Book Appointment</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard
