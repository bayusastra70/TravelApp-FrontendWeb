const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createBooking(data: any) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    }),
  })

  return res.json()
}

export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`)
  return res.json()
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      changedBy: "ADMIN",
    }),
  })

  return res.json()
}

export async function getSchedule(date: string) {
  const res = await fetch(`${API_URL}/bookings/schedule?date=${date}`)
  return res.json()
}

export async function getDashboard() {
  const res = await fetch(`${API_URL}/bookings/admin/dashboard`)
  return res.json()
}

export async function getCalendar(start: string, end: string) {
  const res = await fetch(
    `${API_URL}/bookings/calendar?start=${start}&end=${end}`
  )

  return res.json()
}

export async function getAvailableVehicles(
  startDate: string,
  endDate: string
) {
  const res = await fetch(
    `${API_URL}/vehicles/available?startDate=${startDate}&endDate=${endDate}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch vehicles")
  }

  return res.json()
}

export async function getVehicleCalendar(vehicleId: string, month: string) {
  const res = await fetch(
    `${API_URL}/vehicles/${vehicleId}/calendar?month=${month}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch vehicle calendar")
  }

  return res.json()
}

/* =========================
   NOTIFICATIONS
========================= */

export async function getNotifications() {
  const res = await fetch(`${API_URL}/notifications`)

  if (!res.ok) {
    throw new Error("Failed to fetch notifications")
  }

  return res.json()
}

export async function getUnreadCount() {
  const res = await fetch(`${API_URL}/notifications/unread-count`)

  if (!res.ok) {
    throw new Error("Failed to fetch unread notifications")
  }

  return res.json()
}

export async function markNotificationRead(id: string) {
  await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
  })
}

/* =========================
   VEHICLES
========================= */

export async function getVehicles(){

const res = await fetch(`${API_URL}/vehicles`)

if(!res.ok){
throw new Error("Failed to fetch vehicles")
}

return res.json()

}

export async function createVehicle(data:any){

const res = await fetch(`${API_URL}/vehicles`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
})

if(!res.ok){
throw new Error("Failed to create vehicle")
}

return res.json()

}

export async function uploadVehicleImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_URL}/vehicles/upload`, {
    method: "POST",
    body: formData,
  })

  return res.json()
}

export async function deleteVehicle(id: string) {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) throw new Error("Failed to delete vehicle")

  return res.json()
}

export async function getVehicleById(id: string) {
  const res = await fetch(`${API_URL}/vehicles/${id}`)
  return res.json()
}

export async function updateVehicle(id: string, data: any) {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  return res.json()
}

export async function updatePaymentStatus(id: string, status: string) {
  await fetch(`${API_URL}/bookings/${id}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
}