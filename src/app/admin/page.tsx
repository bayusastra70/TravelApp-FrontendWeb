"use client"

import { useEffect, useState } from "react"
import {
  getDashboard,
  getBookings,
  updateBookingStatus
} from "@/lib/api"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { generatePaymentWA } from "@/lib/wa"

export default function AdminDashboard() {

  const [data, setData] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const d = await getDashboard()
    const b = await getBookings()

    setData(d)
    setBookings(Array.isArray(b) ? b : [])
  }

  async function confirmBooking(id: string) {
    await updateBookingStatus(id, "CONFIRMED")
    load()
  }

  if (!data) return <p className="p-6">Loading...</p>

  /* =========================
     📊 REVENUE CHART (7 DAYS)
  ========================== */
  const last7Days = getLast7Days(bookings)

  /* =========================
     📅 UPCOMING BOOKINGS
  ========================== */
  const upcoming = bookings
    .filter(b => new Date(b.startDate) >= new Date())
    .sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 5)

  /* =========================
     ⚡ LATEST BOOKINGS (FIXED)
  ========================== */
  const latest = bookings
    .filter(b => b.status !== "DONE" && b.status !== "CANCELLED") 
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Business overview & activity
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card title="Bookings Today" value={data.bookingsToday} />
        <Card title="Active Trips" value={data.activeTrips} />
        <Card title="Vehicles Busy" value={data.vehiclesBusy} />
        <Card
          title="Revenue Today"
          value={`Rp ${Number(data.revenueToday).toLocaleString("id-ID")}`}
        />

      </div>

      {/* CHART */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4 text-sm md:text-base">
          Revenue (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={last7Days}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* UPCOMING */}
        <div className="bg-white p-4 md:p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Upcoming Trips</h2>

          {upcoming.length === 0 && (
            <p className="text-sm text-gray-500">No upcoming trips</p>
          )}

          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="border p-3 rounded-lg text-sm">

                <p className="font-medium">{b.guestName}</p>

                <p className="text-gray-500 text-xs">
                  {b.vehicle.name}
                </p>

                <p className="text-xs">
                  {new Date(b.startDate).toLocaleDateString()}
                </p>

              </div>
            ))}
          </div>
        </div>

        {/* LATEST BOOKINGS */}
        <div className="bg-white p-4 md:p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Latest Bookings</h2>

          <div className="space-y-3">

            {latest.map((b) => (

              <div key={b.id} className="border p-3 rounded-lg text-sm space-y-2">

                <div className="flex justify-between">
                  <p className="font-medium">{b.guestName}</p>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                    {b.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  {b.vehicle.name}
                </p>

                {/* ACTION */}
                <div className="flex gap-2">

                  {b.status === "PENDING" && (
                    <button
                      onClick={() => confirmBooking(b.id)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Confirm
                    </button>
                  )}

                  <a
                    href={generatePaymentWA(b)}
                    target="_blank"
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                  >
                    WA
                  </a>

                </div>

              </div>

            ))}

          </div>
        </div>

      </div>

    </div>
  )
}

/* =========================
   📊 HELPER
========================= */

function getLast7Days(bookings: any[]) {
  const result: any[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)

    const dateStr = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit"
    })

    const revenue = bookings
      .filter(b => {
        const created = new Date(b.createdAt)
        return created.toDateString() === d.toDateString()
      })
      .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)

    result.push({
      date: dateStr,
      revenue
    })
  }

  return result
}

/* =========================
   📦 CARD
========================= */

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow">
      <p className="text-xs md:text-sm text-gray-500">{title}</p>
      <p className="text-lg md:text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}