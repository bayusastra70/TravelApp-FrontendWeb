"use client"

import { useEffect, useState } from "react"
import {
  getBookings,
  updateBookingStatus,
  updatePaymentStatus,
} from "@/lib/api"
import { generatePaymentWA } from "@/lib/wa"

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const data = await getBookings()
    setBookings(Array.isArray(data) ? data : [])
  }

  async function confirmBooking(id: string) {
    await updateBookingStatus(id, "CONFIRMED")
    load()
  }

  async function cancelBooking(id: string) {
    await updateBookingStatus(id, "CANCELLED")
    load()
  }

  async function setPayment(id: string, status: string) {
    if (status === "PAID") {
      const ok = confirm("Mark as FULL PAID?")
      if (!ok) return
    }

    await updatePaymentStatus(id, status)
    load()
  }

  async function markDone(id: string) {
    await updateBookingStatus(id, "DONE")
    load()
  }

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.guestName?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode?.toLowerCase().includes(search.toLowerCase()) ||
      b.guestPhone?.includes(search)

    const matchStatus =
      statusFilter === "ALL" || b.status === statusFilter

    return matchSearch && matchStatus
  })

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

        <h1 className="text-xl md:text-2xl font-bold">
          Booking Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

          <input
            placeholder="Search name / code / phone"
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        {filtered.map((b) => (

          <div key={b.id} className="bg-white rounded-xl shadow p-4 space-y-3">

            {/* HEADER */}
            <div className="flex justify-between items-start">

              <div>
                <h2 className="font-bold text-sm md:text-base">
                  {b.bookingCode}
                </h2>
                <p className="text-xs text-gray-500">
                  {b.vehicle?.name}
                </p>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded ${
                  b.status === "DONE"
                    ? "bg-green-200 text-green-700"
                    : b.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-600"
                    : b.status === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {b.status}
              </span>
            </div>

            {/* GUEST */}
            <div>
              <p className="font-medium text-sm">
                {b.guestName}
              </p>
              <a
                href={`https://wa.me/${b.guestPhone}`}
                className="text-green-600 text-xs"
              >
                {b.guestPhone}
              </a>
            </div>

            {/* TRIP */}
            <div className="text-xs text-gray-600 space-y-1">
              <p>📍 {b.pickup} → {b.destination}</p>
              <p>🕐 {b.pickupTime || "-"}</p>
              <p>
                📅{" "}
                {new Date(b.startDate).toLocaleDateString()} -{" "}
                {new Date(b.endDate).toLocaleDateString()}
              </p>

              {b.notes && (
                <p className="italic text-gray-400 line-clamp-2">
                  📝 {b.notes}
                </p>
              )}
            </div>

            {/* PRICE */}
            <div className="text-sm font-semibold text-purple-600">
              Rp {Number(b.totalPrice || 0).toLocaleString("id-ID")}
            </div>

            {/* PAYMENT */}
            <div className="space-y-2">

              <span
                className={`text-[10px] px-2 py-0.5 rounded ${
                  b.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-600"
                    : b.paymentStatus === "DP_PAID"
                    ? "bg-blue-100 text-blue-600"
                    : b.paymentStatus === "DP_PENDING"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {b.paymentStatus}
              </span>

              <div className="flex flex-wrap gap-1">

                {b.paymentStatus === "UNPAID" && (
                  <button
                    onClick={() => setPayment(b.id, "DP_PENDING")}
                    className="text-[11px] bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Request DP
                  </button>
                )}

                {b.paymentStatus === "DP_PENDING" && (
                  <button
                    onClick={() => setPayment(b.id, "DP_PAID")}
                    className="text-[11px] bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Confirm DP
                  </button>
                )}

                {(b.paymentStatus === "DP_PAID" ||
                  b.paymentStatus === "UNPAID") && (
                  <button
                    onClick={() => setPayment(b.id, "PAID")}
                    className="text-[11px] bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Full Paid
                  </button>
                )}
              </div>

              {b.status !== "CANCELLED" &&
                b.paymentStatus !== "PAID" && (
                  <a
                    href={generatePaymentWA(b)}
                    target="_blank"
                    className="block text-center text-xs bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Send WhatsApp
                  </a>
                )}
            </div>

            {/* ACTION */}
            {b.status === "PENDING" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => confirmBooking(b.id)}
                  className="flex-1 bg-green-500 text-white text-xs py-2 rounded"
                >
                  Confirm
                </button>

                <button
                  onClick={() => cancelBooking(b.id)}
                  className="flex-1 bg-red-500 text-white text-xs py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}

            {b.status === "CONFIRMED" && (
              <button
                onClick={() => markDone(b.id)}
                className="w-full bg-blue-600 text-white text-xs py-2 rounded"
              >
                Mark as Done
              </button>
            )}

          </div>

        ))}

      </div>
    </div>
  )
}