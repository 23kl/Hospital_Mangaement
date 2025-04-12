"use client"

import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import LoadingSpinner from "../ui/LoadingSpinner"

const DoctorRoute = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <LoadingSpinner />
  }

  return user && user.role === "doctor" ? <Outlet /> : <Navigate to="/login" />
}

export default DoctorRoute
