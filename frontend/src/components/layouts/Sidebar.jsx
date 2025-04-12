"use client"

import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Home, User, Calendar, Clock, Users, Bell, BarChart2 } from "react-feather"

const Sidebar = () => {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  if (!user) return null

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case "patient":
        return [
          { to: "/patient/dashboard", icon: <Home size={18} />, label: "Dashboard" },
          { to: "/patient/appointments", icon: <Calendar size={18} />, label: "My Appointments" },
          { to: "/patient/profile", icon: <User size={18} />, label: "Profile" },
          { to: "/notifications", icon: <Bell size={18} />, label: "Notifications" },
        ]
      case "doctor":
        return [
          { to: "/doctor/dashboard", icon: <Home size={18} />, label: "Dashboard" },
          { to: "/doctor/appointments", icon: <Calendar size={18} />, label: "Appointments" },
          { to: "/doctor/availability", icon: <Clock size={18} />, label: "Availability" },
          { to: "/doctor/profile", icon: <User size={18} />, label: "Profile" },
          { to: "/notifications", icon: <Bell size={18} />, label: "Notifications" },
        ]
      case "admin":
        return [
          { to: "/admin/dashboard", icon: <BarChart2 size={18} />, label: "Dashboard" },
          { to: "/admin/appointments", icon: <Calendar size={18} />, label: "Appointments" },
          { to: "/admin/doctors", icon: <Users size={18} />, label: "Doctors" },
          { to: "/admin/patients", icon: <Users size={18} />, label: "Patients" },
          { to: "/notifications", icon: <Bell size={18} />, label: "Notifications" },
        ]
      default:
        return []
    }
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-md z-10 hidden md:block">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {getNavItems().map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${isActive(item.to)}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
