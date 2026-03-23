"use client"

import Link from "next/link"
import { LayoutDashboard, CalendarCheck, Car, Menu } from "lucide-react"
import { useState } from "react"

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 🔥 TOP BAR (PASTI DI ATAS SEKARANG) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white shadow">
        <h2 className="font-bold">Admin</h2>

        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* 🔥 SIDEBAR */}
      <aside
        className={`
          bg-white shadow
          min-h-screen w-52
          
          fixed md:static top-0 left-0 z-40
          transition-transform duration-300
          
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-5 mt-14 md:mt-0">

          <h2 className="text-lg font-bold mb-6 hidden md:block">
            Admin Panel
          </h2>

          <nav className="flex flex-col gap-2">
            <SidebarItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarItem href="/admin/booking" icon={<CalendarCheck size={18} />} label="Bookings" />
            <SidebarItem href="/admin/vehicles" icon={<Car size={18} />} label="Vehicles" />
          </nav>

        </div>
      </aside>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition text-sm"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}