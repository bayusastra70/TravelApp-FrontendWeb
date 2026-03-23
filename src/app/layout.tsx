import "./globals.css"
import "leaflet/dist/leaflet.css";
import LayoutWrapper from "@/components/LayoutWrapper"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

      </body>
    </html>
  )
}