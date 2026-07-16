import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import client from "../../api/client";

function formatDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StepDateTime({ stylistId, date, time, onSelectDate, onSelectTime }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [closedReason, setClosedReason] = useState(null);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [visibleMonth]);

  useEffect(() => {
    if (!date || !stylistId) return;
    setLoadingSlots(true);
    setClosedReason(null);
    client
      .get("/api/availability", { params: { stylist_id: stylistId, date } })
      .then((res) => {
        setSlots(res.data.available_slots || []);
        setClosedReason(res.data.reason || null);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date, stylistId]);

  return (
    <div>
      <h2 className="font-display text-2xl mb-2">Pick a Date &amp; Time</h2>
      <p className="text-ink/60 text-sm mb-6">We're closed Mondays. Availability updates live as slots fill up.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-ochre-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
              className="p-1.5 rounded-full hover:bg-ochre-50 text-ink/60"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-medium text-sm">
              {visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
              className="p-1.5 rounded-full hover:bg-ochre-50 text-ink/60"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[11px] text-ink/40 mb-2">
            {WEEKDAY_LABELS.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const key = formatDateKey(d);
              const isPast = d < today;
              const isMonday = d.getDay() === 1;
              const disabled = isPast || isMonday;
              const isSelected = date === key;

              return (
                <button
                  key={key}
                  disabled={disabled}
                  onClick={() => onSelectDate(key)}
                  className={`aspect-square rounded-lg text-sm transition-colors ${
                    disabled
                      ? "text-ink/20 cursor-not-allowed"
                      : isSelected
                      ? "bg-ochre-600 text-cream font-medium"
                      : "hover:bg-ochre-50 text-ink"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!date && <p className="text-ink/50 text-sm">Select a date to see open times.</p>}

          {date && loadingSlots && (
            <div className="flex items-center gap-2 text-ink/50 text-sm">
              <Loader2 size={16} className="animate-spin" /> Checking availability…
            </div>
          )}

          {date && !loadingSlots && closedReason && (
            <p className="text-sm text-ink/50">
              {closedReason === "closed" ? "We're closed on this day." : "This stylist isn't scheduled on this day."}
            </p>
          )}

          {date && !loadingSlots && !closedReason && slots.length === 0 && (
            <p className="text-sm text-ink/50">No open slots left for this day. Try another date.</p>
          )}

          {date && !loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectTime(s)}
                  className={`py-2.5 rounded-lg text-sm border transition-colors ${
                    time === s
                      ? "bg-ochre-600 border-ochre-600 text-cream font-medium"
                      : "border-ochre-200 hover:border-ochre-400 text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
