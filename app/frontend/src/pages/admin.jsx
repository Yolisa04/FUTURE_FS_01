import { useEffect, useState } from "react";
import { listBookings, cancelBooking, getStats } from "@/lib/api";
import { toast } from "sonner";
import { CalendarCheck, X, Users, TrendingUp } from "lucide-react";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, cancelled: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    Promise.all([listBookings(), getStats()])
      .then(([b, s]) => {
        setBookings(b);
        setStats(s);
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      load();
    } catch {
      toast.error("Could not cancel");
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const cards = [
    { label: "Today", value: stats.today, icon: CalendarCheck },
    { label: "Confirmed", value: stats.confirmed, icon: TrendingUp },
    { label: "Cancelled", value: stats.cancelled, icon: X },
    { label: "All time", value: stats.total, icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14" data-testid="admin-page">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="overline mb-2">Studio dashboard</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl leading-[1] tracking-tight text-ink">
            Today at <span className="italic text-terracotta">Ochre Room</span>
          </h1>
        </div>
        <button onClick={load} className="btn-secondary" data-testid="admin-refresh">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-stone/60 border border-line/60 rounded-2xl p-5"
            data-testid={`stat-${c.label.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="flex items-center justify-between">
              <p className="overline">{c.label}</p>
              <c.icon size={16} className="text-olive" />
            </div>
            <div className="mt-3 font-serif-display text-4xl text-ink">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        {["all", "confirmed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider border transition-colors ${
              filter === f
                ? "bg-olive text-bone border-olive"
                : "border-line/70 text-muted hover:border-olive"
            }`}
            data-testid={`filter-${f}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-bone border border-line/60 rounded-2xl overflow-hidden" data-testid="bookings-table">
        <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider text-muted border-b border-line/60 bg-stone/40">
          <div className="col-span-2">Date · Time</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Service</div>
          <div className="col-span-2">Stylist</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {loading && <div className="p-8 text-muted text-center">Loading…</div>}
        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted" data-testid="no-bookings">
            No bookings yet. When guests book online, they'll appear here in real time.
          </div>
        )}
        {!loading &&
          filtered.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-12 items-center px-6 py-4 border-b border-line/40 text-sm last:border-b-0"
              data-testid={`booking-row-${b.id}`}
            >
              <div className="col-span-2">
                <div className="text-ink">{b.date}</div>
                <div className="text-muted text-xs">{b.time}</div>
              </div>
              <div className="col-span-3">
                <div className="text-ink">{b.customer_name}</div>
                <div className="text-muted text-xs">{b.customer_email}</div>
              </div>
              <div className="col-span-3 text-ink">{b.service_name}</div>
              <div className="col-span-2 text-ink">{b.stylist_name}</div>
              <div className="col-span-1">
                <span
                  className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded-full ${
                    b.status === "confirmed"
                      ? "bg-olive/15 text-olive"
                      : "bg-terracotta/15 text-terracotta"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <div className="col-span-1 text-right">
                {b.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="text-xs text-muted hover:text-terracotta"
                    data-testid={`cancel-${b.id}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
