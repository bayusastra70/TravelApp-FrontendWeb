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

export default function BookingPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [pickupCoords, setPickupCoords] = useState<any>(null)
  const [destCoords, setDestCoords] = useState<any>(null)
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

  const searchCars = async () => {
    setLoading(true); setError(""); setRoute(null); setVehicles([]); setSelectedVehicle(null);
    if (!pickup || !destination || !startDate || !endDate) {
      setError("Please fill all booking details"); setLoading(false); return;
    }
    try {
      let p = pickupCoords || await geocode(pickup)
      let d = destCoords || await geocode(destination)
      if (!p || !d) { setError("Location not found"); return; }
      
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${p.lng},${p.lat};${d.lng},${d.lat}?overview=full&geometries=geojson`)
      const data = await res.json()
      if (data.routes?.length > 0) {
        const routeData = data.routes[0]
        setDistance(routeData.distance / 1000)
        setTravelTime(routeData.duration / 60)
        setRoute(routeData.geometry.coordinates.map((c: any) => [c[1], c[0]]))
        
        const vehiclesData = await getAvailableVehicles(startDate.toISOString(), endDate.toISOString())
        setVehicles(vehiclesData)
        setSearched(true)
      }
    } catch (err) { setError("Failed to fetch route"); } finally { setLoading(false); }
  }

  useEffect(() => {
    if (selectedVehicle) setTotalPrice(Number(selectedVehicle.price))
  }, [selectedVehicle])

  const bookNow = async () => {
    if (!selectedVehicle || !guestPhone) { Swal.fire("Required", "Please complete guest info", "warning"); return; }
    try {
      await createBooking({
        vehicleId: selectedVehicle.id, pickup, destination, pickupTime,
        startDate, endDate, guestName, guestPhone, guestEmail, totalPrice, notes
      })
      Swal.fire("Success!", "Booking confirmed", "success")
    } catch { Swal.fire("Error", "Booking failed", "error") }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 md:pb-12 text-gray-900 light">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-8">
        
        {/* LEFT FORM */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            <h3 className="md:col-span-2 font-bold text-lg text-black">Route Details</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Pickup Location</label>
              <LocationAutocomplete value={pickup} onChange={setPickup} onSelect={(p: any) => { setPickup(p.name); setPickupCoords(p); }} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Destination</label>
              <LocationAutocomplete value={destination} onChange={setDestination} onSelect={(p: any) => { setDestination(p.name); setDestCoords(p); }} />
            </div>

            <DatePicker selected={startDate} onChange={setStartDate} className="w-full border border-gray-200 p-3 rounded-xl bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none" placeholderText="Start Date" />
            <DatePicker selected={endDate} onChange={setEndDate} className="w-full border border-gray-200 p-3 rounded-xl bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none" placeholderText="End Date" />
            
            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="border border-gray-200 p-3 rounded-xl bg-white text-black outline-none" />
            
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes / Itinerary" className="border border-gray-200 p-3 rounded-xl bg-white text-black outline-none md:col-span-2 h-24" />

            <button onClick={searchCars} className="md:col-span-2 bg-[#7c3aed] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 active:scale-[0.98] transition-all">
              {loading ? "Calculating..." : "Find Available Cars"}
            </button>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>

          {/* MAP */}
          <div className="h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-inner border border-gray-100 z-10 relative bg-white">
            <Map pickup={pickupCoords} destination={destCoords} route={route} />
          </div>

          {/* VEHICLE LIST */}
          {searched && (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {vehicles.map((v) => (
                <div key={v.id} onClick={() => setSelectedVehicle(v)} className={`min-w-[240px] bg-white rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${selectedVehicle?.id === v.id ? "border-[#7c3aed] ring-4 ring-purple-50" : "border-transparent"}`}>
                  <img src={`${API_URL}${v.imageUrl}`} className="h-40 w-full object-cover rounded-t-2xl" />
                  <div className="p-4">
                    <p className="font-bold text-black">{v.name}</p>
                    <p className="text-sm text-gray-500 font-medium">{v.capacity} pax</p>
                    <p className="text-[#7c3aed] font-extrabold mt-1">Rp {Number(v.price).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GUEST INFO */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-black mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Full Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="border border-gray-200 p-3 rounded-xl bg-white text-black outline-none md:col-span-2" />
              <input placeholder="WhatsApp Phone *" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ""))} className="border border-gray-200 p-3 rounded-xl bg-white text-black outline-none" />
              <input placeholder="Email Address" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="border border-gray-200 p-3 rounded-xl bg-white text-black outline-none" />
            </div>
          </div>
        </div>

        {/* SIDEBAR SUMMARY (DESKTOP) */}
        <div className="hidden md:block">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 sticky top-8 space-y-4">
            <h2 className="font-bold text-xl text-black">Order Summary</h2>
            <div className="space-y-3 text-sm border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-bold text-black">{selectedVehicle?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Distance</span>
                <span className="font-bold text-black">{distance ? distance.toFixed(1) + " km" : "-"}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-black text-lg">Total</span>
              <span className="text-2xl font-black text-[#7c3aed]">{totalPrice ? `Rp ${totalPrice.toLocaleString("id-ID")}` : "-"}</span>
            </div>
            <button onClick={bookNow} className="w-full bg-[#7c3aed] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#6d28d9] transition-all">Confirm Booking</button>
          </div>
        </div>
      </div>

      {/* MOBILE FOOTER SUMMARY */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 md:hidden z-[9999] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-[max(1.25rem,safe-area-inset-bottom)]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Car</p>
            <p className="font-black text-[#7c3aed] text-lg">
              {totalPrice ? `Rp ${totalPrice.toLocaleString("id-ID")}` : "---"}
            </p>
          </div>
          <button onClick={bookNow} className="bg-[#7c3aed] text-white px-10 py-3.5 rounded-2xl font-bold active:scale-95 transition-all">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}