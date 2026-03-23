"use client"

import { useEffect, useState } from "react"
import { getVehicles, deleteVehicle } from "@/lib/api"
import Link from "next/link"
import Swal from "sweetalert2"

export default function AdminVehicles() {

  const [vehicles, setVehicles] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const data = await getVehicles()
    setVehicles(data)
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Vehicles
        </h1>

        <Link
          href="/admin/vehicles/new"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Vehicle
        </Link>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {vehicles.map((v) => (

          <div
            key={v.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >

            {/* IMAGE */}
            <div className="h-40 relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={
                  v.imageUrl
                    ? `${process.env.NEXT_PUBLIC_API_URL}${v.imageUrl}`
                    : "/no-image.png"
                }
                className="w-full h-full object-contain p-0,5"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">

              <h2 className="font-semibold text-lg">
                {v.name}
              </h2>

              <p className="text-sm text-gray-500">
                {v.type}
              </p>

              <p className="text-xs text-gray-400">
                Plate: {v.plateNumber}
              </p>

              <div className="flex justify-between text-sm mt-2">
                <span>👥 {v.capacity} seats</span>

                <span className="font-bold text-purple-600">
                  Rp {Number(v.price).toLocaleString("id-ID")}
                </span>
              </div>

              {/* STATUS */}
              <div className="mt-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    v.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {v.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* ACTION */}
              <div className="flex gap-2 mt-3">

                <Link
                  href={`/admin/vehicles/${v.id}`}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={async () => {

  const confirm = await Swal.fire({
    title: "Delete Vehicle?",
    text: "This will permanently delete data",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626"
  })

  if (confirm.isConfirmed) {
    try {
      await deleteVehicle(v.id)

      Swal.fire("Deleted", "Vehicle removed", "success")

      load()
    } catch (err) {
      Swal.fire("Error", "Cannot delete (maybe used in booking)", "error")
    }
  }
}}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <Link
  href={`/admin/vehicles/${v.id}/calendar`}
  className="text-xs bg-purple-500 text-white px-3 py-1 rounded"
>
  Calendar
</Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}