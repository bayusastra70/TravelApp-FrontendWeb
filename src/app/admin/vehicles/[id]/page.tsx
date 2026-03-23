"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  getVehicleById,
  updateVehicle,
  uploadVehicleImage
} from "@/lib/api"
import Swal from "sweetalert2"

export default function EditVehicle() {

  const { id } = useParams()
  const router = useRouter()

  const [vehicle, setVehicle] = useState<any>(null)

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const data = await getVehicleById(id as string)
    setVehicle(data)
  }

  async function handleUpload() {
    if (!image) return vehicle.imageUrl

    const res = await uploadVehicleImage(image)
    return res.url
  }

  async function save() {
    try {

      let imageUrl = await handleUpload()

      await updateVehicle(id as string, {
        ...vehicle,
        imageUrl
      })

      Swal.fire("Success", "Vehicle updated", "success")

      router.push("/admin/vehicles")

    } catch (err) {
      Swal.fire("Error", "Failed to update", "error")
    }
  }

  if (!vehicle) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-5">

        <h1 className="text-2xl font-bold">
          ✏️ Edit Vehicle
        </h1>

        {/* IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Vehicle Image
          </label>

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImage(file)
                setPreview(URL.createObjectURL(file))
              }
            }}
            className="border p-2 rounded w-full"
          />

          <img
            src={
              preview ||
              `${process.env.NEXT_PUBLIC_API_URL}${vehicle.imageUrl}`
            }
            className="mt-3 h-40 w-full object-cover rounded-xl"
          />
        </div>

        {/* NAME */}
        <input
          className="border p-3 rounded w-full"
          value={vehicle.name}
          onChange={(e) =>
            setVehicle({ ...vehicle, name: e.target.value })
          }
        />

        {/* TYPE */}
        <input
          className="border p-3 rounded w-full"
          value={vehicle.type}
          onChange={(e) =>
            setVehicle({ ...vehicle, type: e.target.value })
          }
        />

        {/* PLATE */}
        <input
          className="border p-3 rounded w-full"
          value={vehicle.plateNumber}
          onChange={(e) =>
            setVehicle({ ...vehicle, plateNumber: e.target.value })
          }
        />

        {/* CAPACITY */}
        <input
          type="number"
          className="border p-3 rounded w-full"
          value={vehicle.capacity}
          onChange={(e) =>
            setVehicle({ ...vehicle, capacity: Number(e.target.value) })
          }
        />

        {/* PRICE */}
        <input
          type="number"
          className="border p-3 rounded w-full"
          value={vehicle.price}
          onChange={(e) =>
            setVehicle({ ...vehicle, price: Number(e.target.value) })
          }
        />

        <button
          onClick={save}
          className="w-full bg-purple-600 text-white py-3 rounded-xl"
        >
          Save Changes
        </button>

      </div>

    </div>
  )
}
