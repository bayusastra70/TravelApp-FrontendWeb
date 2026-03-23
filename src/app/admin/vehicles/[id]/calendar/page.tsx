"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { getVehicleCalendar } from "@/lib/api"

export default function VehicleCalendarPage() {

  const { id } = useParams()

  const [date, setDate] = useState(new Date())
  const [bookedDates, setBookedDates] = useState<string[]>([])

  useEffect(() => {
    load()
  }, [date])

  async function load() {
    const month = date.toISOString().slice(0, 7) // YYYY-MM
    const res = await getVehicleCalendar(id as string, month)
    setBookedDates(res.bookedDates)
  }

  // 🔥 highlight tanggal booked
  function tileClassName({ date }: any) {
    const d = date.toISOString().split("T")[0]

    if (bookedDates.includes(d)) {
      return "bg-red-400 text-white rounded-full"
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Vehicle Calendar
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-fit">

        <Calendar
          onChange={(d: any) => setDate(d)}
          value={date}
          tileClassName={tileClassName}
        />

      </div>

      {/* LEGEND */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded-full"></div>
          <span>Booked</span>
        </div>
      </div>

    </div>
  )
}