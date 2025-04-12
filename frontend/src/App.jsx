import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import PrivateRoute from "./components/routing/PrivateRoute"
import DoctorRoute from "./components/routing/DoctorRoute"
import AdminRoute from "./components/routing/AdminRoute"

// Layouts
import MainLayout from "./components/layouts/MainLayout"

// Public Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import RegisterDoctorPage from "./pages/auth/RegisterDoctorPage"
import DoctorListPage from "./pages/DoctorListPage"
import DoctorDetailsPage from "./pages/DoctorDetailsPage"

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard"
import BookAppointment from "./pages/patient/BookAppointment"
import MyAppointments from "./pages/patient/MyAppointments"
import AppointmentDetails from "./pages/patient/AppointmentDetails"
import PatientProfile from "./pages/patient/PatientProfile"

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard"
import DoctorAppointments from "./pages/doctor/DoctorAppointments"
import DoctorProfile from "./pages/doctor/DoctorProfile"
import ManageAvailability from "./pages/doctor/ManageAvailability"

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminAppointments from "./pages/admin/AdminAppointments"
import AdminDoctors from "./pages/admin/AdminDoctors"
import AdminPatients from "./pages/admin/AdminPatients"

// Shared Pages
import NotificationsPage from "./pages/NotificationsPage"

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="register-doctor" element={<RegisterDoctorPage />} />
              <Route path="doctors" element={<DoctorListPage />} />
              <Route path="doctors/:id" element={<DoctorDetailsPage />} />

              {/* Patient Routes */}
              <Route path="patient" element={<PrivateRoute />}>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="book-appointment/:doctorId" element={<BookAppointment />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="appointments/:id" element={<AppointmentDetails />} />
                <Route path="profile" element={<PatientProfile />} />
              </Route>

              {/* Doctor Routes */}
              <Route path="doctor" element={<DoctorRoute />}>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="availability" element={<ManageAvailability />} />
              </Route>

              {/* Admin Routes */}
              <Route path="admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="patients" element={<AdminPatients />} />
              </Route>

              {/* Shared Routes */}
              <Route path="notifications" element={<PrivateRoute />}>
                <Route index element={<NotificationsPage />} />
              </Route>
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
