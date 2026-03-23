import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="bg-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center px-4 md:px-6">

          {/* TEXT */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Explore Bali With Private Driver
            </h1>

            <p className="mt-4 text-gray-600 text-base md:text-lg">
              Airport Transfer • Private Tour • Chauffeur Service
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                href="/booking"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg text-center"
              >
                Book Transport
              </Link>

              <Link
                href="/booking"
                className="border border-gray-300 px-6 py-3 rounded-lg text-center"
              >
                View Vehicles
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <img
              src="/banner1.jpg"
              className="rounded-xl w-full h-[160px] md:h-[220px] object-cover"
            />

            <img
              src="/banner2.jpg"
              className="rounded-xl w-full h-[160px] md:h-[220px] object-cover md:mt-10"
            />
          </div>

        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-6xl mx-auto py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
        <Stat number="500+" label="Happy Guests" />
        <Stat number="50+" label="Vehicles" />
        <Stat number="24/7" label="Support" />
        <Stat number="10+" label="Years Experience" />
      </section>

      {/* ROUTES */}
      <section className="max-w-6xl mx-auto py-10 md:py-12 px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
          Popular Routes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <RouteCard title="Airport → Ubud" time="1h 20m" price="350k" />
          <RouteCard title="Airport → Seminyak" time="40m" price="200k" />
          <RouteCard title="Airport → Uluwatu" time="1h" price="300k" />
        </div>
      </section>

      {/* VEHICLES */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">
            Our Vehicles
          </h2>

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x">
            <VehicleCard
              name="Toyota Avanza"
              capacity="5 passengers"
              img="/car1.jpg"
            />
            <VehicleCard
              name="Toyota Innova"
              capacity="6 passengers"
              img="/car2.jpg"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center px-4">
        <h2 className="text-2xl md:text-4xl font-bold">
          Ready to Explore Bali?
        </h2>

        <p className="mt-3 text-base md:text-lg">
          Book your private transport in seconds
        </p>

        <Link
          href="/booking"
          className="inline-block mt-6 bg-white text-black px-6 md:px-8 py-3 rounded-lg text-base md:text-lg"
        >
          Start Booking
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 py-8 md:py-10 text-center text-sm px-4">
        <p>Bali Private Transport</p>
        <p className="mt-2">
          Airport Transfer • Daily Tour • Chauffeur Service
        </p>
      </footer>

    </div>
  )
}

/* ================= COMPONENTS ================= */

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-bold text-purple-600">
        {number}
      </p>
      <p className="text-gray-500 text-sm md:text-base">
        {label}
      </p>
    </div>
  )
}

function RouteCard({
  title,
  time,
  price,
}: {
  title: string
  time: string
  price: string
}) {
  return (
    <div className="bg-white shadow rounded-xl p-5 md:p-6 text-center hover:shadow-lg transition">
      <h3 className="font-semibold text-base md:text-lg">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 text-sm">
        Travel Time: {time}
      </p>

      <p className="text-purple-600 font-bold mt-2">
        From Rp {price}
      </p>
    </div>
  )
}

function VehicleCard({
  name,
  capacity,
  img,
}: {
  name: string
  capacity: string
  img: string
}) {
  return (
    <div className="min-w-[220px] snap-start bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <div className="h-40">
        <img src={img} className="w-full h-full object-cover" />
      </div>

      <div className="p-4 text-center">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-500 text-sm">{capacity}</p>
      </div>
    </div>
  )
}