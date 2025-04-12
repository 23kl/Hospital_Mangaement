"use client"

import { useContext } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import { AuthContext } from "../../context/AuthContext"

const MainLayout = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        {user && <Sidebar />}

        <main className={`flex-1 p-4 ${user ? "md:ml-64" : ""}`}>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default MainLayout
