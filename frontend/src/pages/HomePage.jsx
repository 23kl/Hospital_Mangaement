import { Link } from "react-router-dom"
import { Search, Calendar, Shield } from "react-feather"
import Button from "../components/ui/Button"

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Health, Our Priority</h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience the future of healthcare with our smart hospital management system. Book appointments,
                consult with specialists, and manage your health records all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/doctors">
                  <Button size="lg">Find a Doctor</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://img.freepik.com/free-vector/hospital-building-concept-illustration_114360-8440.jpg"
                alt="Smart Hospital"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Specialists</h3>
              <p className="text-gray-600">
                Search and find the best specialists for your health needs from our network of qualified doctors.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Appointments</h3>
              <p className="text-gray-600">
                Book appointments online with just a few clicks and manage your schedule effortlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Health Records</h3>
              <p className="text-gray-600">
                Your health data is securely stored and accessible only to you and your authorized doctors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Register an Account</h3>
              <p className="text-gray-600 text-center">
                Create your personal account to access all features of our platform.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Doctor</h3>
              <p className="text-gray-600 text-center">
                Browse through our list of specialists and choose the one that fits your needs.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
              <p className="text-gray-600 text-center">
                Select a convenient time slot and book your appointment online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have already transformed their healthcare experience with our smart hospital
            management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Register as Patient
              </Button>
            </Link>
            <Link to="/register-doctor">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Register as Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-4">
                  R
                </div>
                <div>
                  <h4 className="font-semibold">Rahul Sharma</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The appointment booking process is so simple and efficient. I love how I can see all my past
                appointments and medical history in one place."
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-4">
                  P
                </div>
                <div>
                  <h4 className="font-semibold">Dr. Priya Patel</h4>
                  <p className="text-gray-500 text-sm">Cardiologist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This platform has streamlined my practice. Managing appointments and patient records has never been
                easier."
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-semibold">Ananya Gupta</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I can easily find specialists for my family's different health needs. The notification system keeps me
                updated about my appointments."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
