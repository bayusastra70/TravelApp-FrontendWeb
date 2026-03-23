import AdminSidebar from "@/components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <main className="flex-1 bg-gray-100 pt-16 md:pt-0 p-4">
        {children}
      </main>

    </div>
  )
}