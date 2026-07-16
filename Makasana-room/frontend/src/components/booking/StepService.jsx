import { Clock } from "lucide-react";

export default function StepService({ services, selected, onSelect }) {
  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Choose a Service</h2>
      <p className="text-ink/60 text-sm mb-6">Pick what you're coming in for. You can always add more once you're here.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`text-left border rounded-2xl p-5 transition-all ${
              selected?.id === s.id
                ? "border-ochre-600 bg-ochre-50 shadow-soft"
                : "border-ochre-100 hover:border-ochre-300"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-ink">{s.name}</h3>
              <span className="text-ochre-700 font-medium">R{s.price}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink/50">
              <Clock size={13} /> {s.duration_minutes} min
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
