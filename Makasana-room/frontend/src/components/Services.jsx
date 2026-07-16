import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import client from "../api/client";

const FALLBACK_SERVICES = [
  { id: "1", name: "Chiskop", duration_minutes: 20, price: 50, category: "Hair" },
  { id: "2", name: "Tinted Fade", duration_minutes: 80, price: 150, category: "Color" },
  { id: "3", name: "Fade", duration_minutes: 45, price: 120, category: "Hair" },
  { id: "4", name: "Tinted Tapper Fade", duration_minutes: 70, price: 130, category: "Color" },
  { id: "5", name: "Tapper Fade", duration_minutes: 70, price: 110, category: "Hair" },
  { id: "6", name: "Brush Cut", duration_minutes: 30, price: 80, category: "Hair" },
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/api/services")
      .then((res) => {
        if (res.data?.length) setServices(res.data);
      })
      .catch(() => {
        // API not reachable yet - the fallback list above keeps the page usable
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs tracking-[0.2em] uppercase text-ochre-600">Our Menu</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3 mb-4">Services &amp; Pricing</h2>
        <p className="text-ink/60">
          A curated menu built around real results, not gimmicks. Every service ends with a style consult.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <div
            key={s.id}
            className="border border-ochre-100 rounded-2xl p-6 hover:shadow-soft hover:border-ochre-300 transition-all bg-white/60"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-xl text-ink">{s.name}</h3>
              <span className="text-ochre-700 font-medium">R{s.price}</span>
            </div>
            {s.description && <p className="text-sm text-ink/60 mb-3">{s.description}</p>}
            <div className="flex items-center gap-2 text-xs text-ink/50">
              <Clock size={14} />
              {s.duration_minutes} min
              {s.category && (
                <span className="ml-auto bg-ochre-50 text-ochre-700 px-2.5 py-1 rounded-full">{s.category}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/booking"
          className="inline-block bg-ochre-600 hover:bg-ochre-700 text-cream px-7 py-3.5 rounded-full font-medium transition-colors"
        >
          Book Your Service
        </Link>
      </div>
    </section>
  );
}
