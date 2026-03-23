"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import LocationAutocomplete from "@/components/LocationAutocomplete"
import { createBooking, getAvailableVehicles } from "@/lib/api"
import { geocode } from "@/lib/geocode"
import Swal from "sweetalert2"

const Map = dynamic(() => import("./Map"), { ssr: false })

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type Coord = {
  lat: number
  lng: number
}

export default function BookingPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")

  const [pickupCoords, setPickupCoords] = useState<Coord | null>(null)
  const [destCoords, setDestCoords] = useState<Coord | null>(null)

  const [route, setRoute] = useState<any>(null)

  const [distance, setDistance] = useState(0)
  const [travelTime, setTravelTime] = useState(0)

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const [pickupTime, setPickupTime] = useState("08:00")

  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [notes, setNotes] = useState("")

  const [error, setError] = useState("")

  /* ================= SEARCH ================= */
  const searchCars = async () => {
    setLoading(true)
    setError("")
    setRoute(null)
    setVehicles([])
    setSelectedVehicle(null)
    setTotalPrice(null)

    if (!pickup || !destination) {
      setError("Please enter pickup and destination")
      setLoading(false)
      return
    }

    let p: Coord | null = pickupCoords
    let d: Coord | null = destCoords

    try {
      if (!p) p = await geocode(pickup)
      if (!d) d = await geocode(destination)

      if (!p || !d) {
        setError("Location not found")
        return
      }

      if (p.lat === d.lat && p.lng === d.lng) {
        setError("Pickup and destination cannot be the same")
        return
      }

      setPickupCoords(p)
      setDestCoords(d)

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${p.lng},${p.lat};${d.lng},${d.lat}?overview=full&geometries=geojson`
      )

      const data = await res.json()

      if (!data.routes?.length) {
        setError("Route not found")
        return
      }

      const routeData = data.routes[0]

      setDistance(routeData.distance / 1000)
      setTravelTime(routeData.duration / 60)

      const coords = routeData.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      )

      setRoute(coords)

      if (startDate && endDate) {
        const vehiclesData = await getAvailableVehicles(
          startDate.toISOString(),
          endDate.toISOString()
        )
        setVehicles(vehiclesData)
      }

      setSearched(true)
    } catch (err) {
      console.error(err)
      setError("Failed to calculate route")
    } finally {
      setLoading(false)
    }
  }

  /* ================= PRICE ================= */
  useEffect(() => {
    if (selectedVehicle) {
      setTotalPrice(Number(selectedVehicle.price))
    }
  }, [selectedVehicle])

  /* ================= BOOKING ================= */
  const bookNow = async () => {
    if (!selectedVehicle) {
      Swal.fire("Oops", "Please select vehicle", "warning")
      return
    }

    if (!guestPhone || guestPhone.length < 8) {
      Swal.fire("Invalid Phone", "Enter valid phone number", "warning")
      return
    }

    try {
      await createBooking({
        vehicleId: selectedVehicle.id,
        pickup,
        destination,
        pickupTime,
        startDate,
        endDate,
        guestName,
        guestPhone,
        guestEmail,
        totalPrice,
        notes,
      })

      Swal.fire("Success 🎉", "Booking received", "success")
    } catch {
      Swal.fire("Error", "Booking failed", "error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 p-4 md:p-8">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* FORM */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm">Pickup</label>
              <LocationAutocomplete
                value={pickup}
                onChange={setPickup}
                onSelect={(p: any) => {
                  setPickup(p.name)
                  setPickupCoords({ lat: p.lat, lng: p.lng })
                }}
              />
            </div>

            <div>
              <label className="text-sm">Destination</label>
              <LocationAutocomplete
                value={destination}
                onChange={setDestination}
                onSelect={(p: any) => {
                  setDestination(p.name)
                  setDestCoords({ lat: p.lat, lng: p.lng })
                }}
              />
            </div>

            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="border p-3 rounded-lg w-full"
              placeholderText="Start Date"
            />

            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              className="border p-3 rounded-lg w-full"
              placeholderText="End Date"
            />

            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes / itinerary"
              className="border p-3 rounded-lg md:col-span-2"
            />

            <button
              onClick={searchCars}
              className="md:col-span-2 bg-purple-600 text-white py-3 rounded-lg"
            >
              {loading ? "Searching..." : "Search Cars"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* MAP */}
          <div className="h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Map pickup={pickupCoords} destination={destCoords} route={route} />
          </div>

          {/* VEHICLES */}
          {searched && (
            <div className="flex gap-4 overflow-x-auto snap-x pb-2">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`min-w-[220px] snap-start bg-white rounded-xl shadow ${
                    selectedVehicle?.id === v.id ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <img
                    src={`${API_URL}${v.imageUrl}`}
                    className="h-40 w-full object-cover rounded-t-xl"
                  />
                  <div className="p-3">
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-sm text-gray-500">{v.capacity} pax</p>
                    <p className="text-purple-600 font-bold">
                      Rp {Number(v.price).toLocaleString("id-ID")}/Day
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GUEST INFO */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Guest Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  placeholder="Full Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <input
                placeholder="Phone *"
                value={guestPhone}
                onChange={(e) =>
                  setGuestPhone(e.target.value.replace(/\D/g, ""))
                }
                className="border p-3 rounded-lg"
              />

              <input
                placeholder="Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="border p-3 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* DESKTOP SUMMARY */}
        <div className="hidden md:block bg-white p-4 rounded-xl shadow sticky top-8">
          <h2 className="text-sm text-gray-500 mb-3">Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Vehicle</span>
              <span>{selectedVehicle?.name || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span>Distance</span>
              <span>{distance ? distance.toFixed(1) + " km" : "-"}</span>
            </div>

            <div className="flex justify-between">
              <span>Time</span>
              <span>{travelTime ? Math.round(travelTime) + " min" : "-"}</span>
            </div>
          </div>

          <div className="mt-4 border-t pt-3 flex justify-between">
            <span>Total</span>
            <span className="text-purple-600 font-bold">
              {totalPrice ? `Rp ${totalPrice.toLocaleString("id-ID")}` : "-"} /Day
            </span>
          </div>

          <button
            onClick={bookNow}
            className="mt-4 w-full bg-purple-600 text-white py-2.5 rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* MOBILE SUMMARY */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">
              {selectedVehicle?.name || "No vehicle"}
            </p>
            <p className="font-semibold text-purple-600 text-sm">
              {totalPrice ? `Rp ${totalPrice.toLocaleString("id-ID")}` : "-"}
            </p>
          </div>

          <button
            onClick={bookNow}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  )
}