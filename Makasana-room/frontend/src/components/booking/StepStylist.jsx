export default function StepStylist({ stylists, selected, onSelect }) {
  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Choose Your Stylist</h2>
      <p className="text-ink/60 text-sm mb-6">Not sure who to pick? Any of them will take great care of you.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {stylists.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`text-left border rounded-2xl p-5 flex gap-4 items-center transition-all ${
              selected?.id === s.id
                ? "border-ochre-600 bg-ochre-50 shadow-soft"
                : "border-ochre-100 hover:border-ochre-300"
            }`}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-ochre-100 shrink-0 flex items-center justify-center font-display text-ochre-700 text-lg">
              {s.photo_url ? (
                <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
              ) : (
                s.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-medium text-ink">{s.name}</h3>
              <p className="text-xs text-ochre-600">{s.role}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
