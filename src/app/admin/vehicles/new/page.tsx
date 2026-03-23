"use client"

import { useState } from "react"
import { createVehicle, uploadVehicleImage } from "@/lib/api"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function NewVehicle() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [plateNumber, setPlateNumber] = useState("")
  const [capacity, setCapacity] = useState(4)

  const [price, setPrice] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  async function handleUpload() {
    if (!image) return ""
    const res = await uploadVehicleImage(image)
    return res.url
  }

  function formatPrice(value: string) {
    const number = value.replace(/\D/g, "")
    return new Intl.NumberFormat("id-ID").format(Number(number))
  }

  async function save() {
    try {

      if (!name || !plateNumber) {
        return Swal.fire("Warning", "Please fill required fields", "warning")
      }

      let imageUrl = ""

      if (image) {
        imageUrl = await handleUpload()
      }

      await createVehicle({
        name,
        type,
        plateNumber,
        capacity: Number(capacity),
        price: Number(price.replace(/\./g, "")),
        imageUrl
      })

      Swal.fire("Success", "Vehicle created", "success")

      router.push("/admin/vehicles")

    } catch (err) {
      Swal.fire("Error", "Failed to create vehicle", "error")
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-5">

        <h1 className="text-2xl font-bold">
          🚗 Add New Vehicle
        </h1>

        {/* IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Vehicle Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImage(file)
                setPreview(URL.createObjectURL(file))
              }
            }}
            className="border p-2 rounded w-full"
          />

          {preview && (
            <img
              src={preview}
              className="mt-3 h-40 w-full object-cover rounded-xl"
            />
          )}
        </div>

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Vehicle Name *
          </label>
          <input
            className="border p-3 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Type
          </label>
          <input
            className="border p-3 rounded w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        {/* PLATE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Plate Number *
          </label>
          <input
            className="border p-3 rounded w-full"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
        </div>

        {/* CAPACITY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Capacity
          </label>
          <input
            type="number"
            className="border p-3 rounded w-full"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price (IDR)
          </label>
          <input
            type="text"
            className="border p-3 rounded w-full"
            value={price}
            onChange={(e) => setPrice(formatPrice(e.target.value))}
            placeholder="e.g. 300.000"
          />
        </div>

        <button
          onClick={save}
          className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Save Vehicle
        </button>

      </div>

    </div>
  )
}