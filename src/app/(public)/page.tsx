import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen text-gray-900 light" style={{ colorScheme: 'light' }}>

      {/* HERO */}
      <section className="bg-[#f3f4f6] py-12 md:py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-4 md:px-8">

          {/* TEXT */}
          <div className="z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-black tracking-tight">
              Explore Bali With <span className="text-[#7c3aed]">Private Driver</span>
            </h1>

            <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-lg">
              Airport Transfer • Private Tour • Chauffeur Service. 
              Safe, comfortable, and reliable transport for your Bali holiday.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/booking"
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-2xl text-center font-bold shadow-lg shadow-purple-200 transition-all active:scale-95"
              >
                Book Transport
              </Link>

              <Link
                href="/booking"
                className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-2xl text-center font-bold hover:bg-gray-50 transition-all active:scale-95"
              >
                View Vehicles
              </Link>
            </div>
          </div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 bg-purple-100/50 rounded-full blur-3xl -z-10"></div>
            <img
              src="/banner1.jpg"
              className="rounded-3xl w-full h-[200px] md:h-[300px] object-cover shadow-xl border-4 border-white"
            />
            <img
              src="/banner2.jpg"
              className="rounded-3xl w-full h-[200px] md:h-[300px] object-cover md:mt-12 shadow-xl border-4 border-white"
            />
          </div>

        </div>
      </section>

      {/* TRUST STATS */}
      <section className="max-w-6xl mx-auto py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
        <Stat number="500+" label="Happy Guests" />
        <Stat number="50+" label="Vehicles" />
        <Stat number="24/7" label="Support" />
        <Stat number="10+" label="Years Experience" />
      </section>

      {/* ROUTES */}
      <section className="bg-[#f9fafb] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-black">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RouteCard title="Airport → Ubud" time="1h 20m" price="350k" />
            <RouteCard title="Airport → Seminyak" time="40m" price="200k" />
            <RouteCard title="Airport → Uluwatu" time="1h" price="300k" />
          </div>
        </div>
      </section>

      {/* VEHICLES SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Our Fleet</h2>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            <VehicleCard name="Toyota Avanza" capacity="5 pax" img="/car1.jpg" />
            <VehicleCard name="Toyota Xenia" capacity="6 pax" img="/xenia.jpg" />
            <VehicleCard name="Toyota Terios" capacity="6 pax" img="/terios.jpg" />
            <VehicleCard name="Hiace Luxury" capacity="12 pax" img="/hiace.jpg" />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-[#7c3aed] text-white text-center px-6 mx-4 md:mx-10 my-10 rounded-[2rem] shadow-2xl shadow-purple-300">
        <h2 className="text-3xl md:text-5xl font-bold">Ready to Explore Bali?</h2>
        <p className="mt-4 text-purple-100 text-lg">Book your private transport in seconds</p>
        <Link
          href="/booking"
          className="inline-block mt-8 bg-white text-[#7c3aed] px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
        >
          Start Booking Now
        </Link>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-500">
        <p className="font-bold text-black">PutuMertaSari Transport</p>
        <p className="mt-2 text-sm">© 2026 Bali Private Transport Service</p>
      </footer>
    </div>
  )
}

/* --- REUSABLE COMPONENTS --- */

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
      <p className="text-3xl font-bold text-[#7c3aed]">{number}</p>
      <p className="text-gray-500 font-medium mt-1">{label}</p>
    </div>
  )
}

function RouteCard({ title, time, price }: { title: string; time: string; price: string }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all group">
      <h3 className="font-bold text-xl text-black group-hover:text-[#7c3aed]">{title}</h3>
      <p className="text-gray-500 mt-2">Travel Time: {time}</p>
      <p className="text-[#7c3aed] font-extrabold text-lg mt-3">Rp {price}</p>
    </div>
  )
}

function VehicleCard({ name, capacity, img }: { name: string; capacity: string; img: string }) {
  return (
    <div className="min-w-[280px] snap-start bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
      <div className="h-48 overflow-hidden">
        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-5 text-center">
        <h3 className="font-bold text-lg text-black">{name}</h3>
        <p className="text-gray-500">{capacity}</p>
      </div>
    </div>
  )
}