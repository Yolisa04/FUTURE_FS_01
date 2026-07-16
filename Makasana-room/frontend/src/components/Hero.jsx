import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ochre-50 via-cream to-ochre-100" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ochre-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-sage/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-ochre-700 bg-ochre-100 px-4 py-1.5 rounded-full mb-6">
            Neighborhood Salon &amp; Studio
          </span>
          <h1 className="font-display text-4xl md:text-6xl leading-tight text-ink mb-6">
            Modern grooming, intentional craft, and cuts that fit your life.
          </h1>
          <p className="text-ink/70 text-lg mb-8 max-w-md">
            <> <b>Makasana Room</b> is where precision meets warmth - fades, tapers, tints, and rituals crafted for the way you actually live.</>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/booking"
              className="bg-ochre-600 hover:bg-ochre-700 text-cream px-7 py-3.5 rounded-full font-medium transition-colors shadow-soft"
            >
              Book an Appointment
            </Link>
            <a
              href="#services"
              className="border border-ochre-300 hover:border-ochre-500 text-ink px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              View Services
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
              alt="Makasana Room salon interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-cream rounded-2xl shadow-soft p-5 max-w-[220px] hidden sm:block">
            <p className="text-3xl font-display text-ochre-700">4.9</p>
            <p className="text-xs text-ink/60 mt-1">rated by 800+ returning clients</p>
          </div>
        </div>
      </div>
    </section>
  );
}
