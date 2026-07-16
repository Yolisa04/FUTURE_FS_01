export default function StepCustomer({ customer, onChange, errors }) {
  const update = (field, value) => onChange({ ...customer, [field]: value });

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Your Details</h2>
      <p className="text-ink/60 text-sm mb-6">We'll send your confirmation here.</p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
        <div className="sm:col-span-2">
          <label className="text-xs text-ink/50 mb-1 block">Full name</label>
          <input
            value={customer.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Sarah Johnson"
            className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
          />
          {errors?.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-xs text-ink/50 mb-1 block">Email</label>
          <input
            type="email"
            value={customer.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="sarah@example.com"
            className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
          />
          {errors?.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-xs text-ink/50 mb-1 block">Phone</label>
          <input
            value={customer.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 415 555 1234"
            className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
          />
          {errors?.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-ink/50 mb-1 block">Notes (optional)</label>
          <textarea
            value={customer.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Anything we should know before your visit?"
            className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
          />
        </div>
      </div>
    </div>
  );
}
