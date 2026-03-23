export function generatePaymentWA(booking: any) {
  const phone = booking.guestPhone.replace(/^0/, "62")

  let message = `Hi ${booking.guestName},\n\n`
  message += `Your booking has been confirmed ✅\n\n`

  message += `📌 Booking Details:\n`
  message += `Code: ${booking.bookingCode}\n`
  message += `Vehicle: ${booking.vehicle.name}\n`
  message += `Pickup: ${booking.pickup}\n`
  message += `Destination: ${booking.destination}\n`
  message += `Date: ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}\n`
  message += `Pickup Time: ${booking.pickupTime || "-"}\n\n`

  if (booking.paymentStatus === "DP_PENDING") {
    message += `💰 Deposit Required:\n`
    message += `Rp ${Number(booking.dpAmount).toLocaleString("id-ID")}\n\n`
  } else {
    message += `💰 Total Payment:\n`
    message += `Rp ${Number(booking.totalPrice).toLocaleString("id-ID")}\n\n`
  }

  message += `🏦 Bank Transfer:\n`
  message += `BCA - 123456789\n`
  message += `a/n Yuda Travel\n\n`

  message += `Please send your payment receipt via WhatsApp 🙏`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}