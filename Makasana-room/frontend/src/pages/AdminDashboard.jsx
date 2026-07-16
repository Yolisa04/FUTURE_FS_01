import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { LogOut, Loader2, CalendarCheck, CheckCircle2, XCircle, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="border border-ochre-100 rounded-2xl p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ink/50">{label}</span>
        <Icon size={16} className="text-ochre-500" />
      </div>
      <p className="font-display text-3xl text-ink">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState({});
  const [stylists, setStylists] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, servicesRes, stylistsRes] = await Promise.all([
        client.get("/api/bookings/stats"),
        client.get("/api/bookings", { params: filter === "all" ? {} : { status: filter } }),
        client.get("/api/services"),
        client.get("/api/stylists"),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setServices(Object.fromEntries(servicesRes.data.map((s) => [s.id, s])));
      setStylists(Object.fromEntries(stylistsRes.data.map((s) => [s.id, s])));
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/admin/login");
      } else {
        toast.error("Couldn't load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  }, [filter, logout, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancel = async (bookingId) => {
    setUpdatingId(bookingId);
    try {
      await client.patch(`/api/bookings/${bookingId}/status`, { status: "cancelled" });
      toast.success("Booking cancelled");
      loadData();
    } catch {
      toast.error("Couldn't cancel that booking");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl">Admin Dashboard</h1>
          <p className="text-ink/50 text-sm mt-1">Manage bookings across every stylist.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-ink/60 hover:text-ink border border-ochre-200 px-4 py-2 rounded-full"
        >
          <LogOut size={15} /> Log Out
        </button>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={CalendarCheck} label="Today's Appointments" value={stats.today} />
          <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} />
          <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled} />
          <StatCard icon={ListChecks} label="Total Bookings" value={stats.total} />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              filter === f.key
                ? "bg-ochre-600 border-ochre-600 text-cream"
                : "border-ochre-200 text-ink/60 hover:border-ochre-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="border border-ochre-100 rounded-2xl overflow-hidden bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-ink/50 py-16">
            <Loader2 className="animate-spin" size={18} /> Loading bookings…
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-ink/40 py-16 text-sm">No bookings match this filter.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink/40 border-b border-ochre-100">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Stylist</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-ochre-50 last:border-0 hover:bg-ochre-50/40">
                  <td className="px-5 py-3">{b.date}</td>
                  <td className="px-5 py-3">{b.time}</td>
                  <td className="px-5 py-3">
                    <div>{b.customer?.name}</div>
                    <div className="text-xs text-ink/40">{b.customer?.email}</div>
                  </td>
                  <td className="px-5 py-3">{services[b.service_id]?.name || "—"}</td>
                  <td className="px-5 py-3">{stylists[b.stylist_id]?.name || "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        b.status === "confirmed"
                          ? "bg-ochre-100 text-ochre-700"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={updatingId === b.id}
                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {updatingId === b.id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
