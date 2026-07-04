import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import {
  getServices,
  getStylists,
  getAvailability,
  createBooking,
} from "@/lib/api";
import { toast } from "sonner";

const steps = [
  { key: "service", label: "Service" },
  { key: "stylist", label: "Stylist" },
  { key: "date", label: "Date & Time" },
  { key: "details", label: "Your Details" },
];

const fmtDate = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state?.serviceId;

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [serviceId, setServiceId] = useState(preselected || null);
  const [stylistId, setStylistId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [details, setDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
    getStylists().then(setStylists).catch(() => {});
  }, []);

  useEffect(() => {
    if (step === 2 && stylistId && date) {
      setLoadingSlots(true);
      getAvailability(stylistId, fmtDate(date))
        .then((d) => setSlots(d.slots))
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [step, stylistId, date]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );
  const selectedStylist = useMemo(
    () => stylists.find((s) => s.id === stylistId),
    [stylists, stylistId]
  );

  const canNext = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!stylistId;
    if (step === 2) return !!date && !!time;
    if (step === 3)
      return (
        details.customer_name &&
        details.customer_email &&
        details.customer_phone
      );
    return false;
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        service_id: serviceId,
        stylist_id: stylistId,
        date: fmtDate(date),
        time,
        ...details,
      };
      const res = await createBooking(payload);
      setConfirmation(res);
      toast.success("Appointment confirmed!");
    } catch (e) {
      const msg = e?.response?.data?.detail || "Could not create booking.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center" data-testid="booking-confirmation">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-olive text-bone mb-6">
          <Check size={28} />
        </div>
        <p className="overline mb-3">You're on the books</p>
        <h1 className="font-serif-display text-5xl leading-tight text-ink">
          See you soon, <span className="italic text-terracotta">{confirmation.customer_name.split(" ")[0]}</span>.
        </h1>
        <div className="mt-8 bg-stone/60 border border-line/60 rounded-2xl p-6 text-left">
          <div className="flex justify-between py-2 border-b border-line/60">
            <span className="text-muted text-sm">Service</span>
            <span className="text-ink">{confirmation.service_name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-line/60">
            <span className="text-muted text-sm">Stylist</span>
            <span className="text-ink">{confirmation.stylist_name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-line/60">
            <span className="text-muted text-sm">Date</span>
            <span className="text-ink">{confirmation.date}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted text-sm">Time</span>
            <span className="text-ink">{confirmation.time}</span>
          </div>
        </div>
        <p className="text-muted text-sm mt-6">
          A confirmation email is on its way to {confirmation.customer_email}.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="btn-secondary" data-testid="return-home">
            Back to home
          </Link>
          <button
            onClick={() => {
              setConfirmation(null);
              setStep(0);
              setServiceId(null);
              setStylistId(null);
              setDate(null);
              setTime(null);
              setDetails({ customer_name: "", customer_email: "", customer_phone: "", notes: "" });
            }}
            className="btn-primary"
            data-testid="book-another"
          >
            Book another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-16" data-testid="booking-page">
      <div className="mb-10">
        <p className="overline mb-3">Reserve your seat</p>
        <h1 className="font-serif-display text-4xl sm:text-5xl leading-[1] tracking-tight text-ink">
          Let's find the right <span className="italic text-terracotta">time for you</span>.
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 sm:gap-4 mb-10" data-testid="stepper">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2 sm:gap-4 flex-1">
            <div
              className={`flex items-center gap-2 ${
                i <= step ? "text-ink" : "text-muted"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-colors ${
                  i < step
                    ? "bg-olive text-bone border-olive"
                    : i === step
                    ? "bg-terracotta text-bone border-terracotta"
                    : "border-line text-muted"
                }`}
                data-testid={`step-${i}`}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs sm:text-sm hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px flex-1 bg-line" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-stone/40 border border-line/60 rounded-3xl p-6 md:p-10 min-h-[420px]">
        {step === 0 && (
          <div data-testid="step-service">
            <h2 className="font-serif-display text-3xl text-ink mb-6">Choose your service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => {
                const active = s.id === serviceId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setServiceId(s.id)}
                    className={`text-left p-5 rounded-2xl border transition-all ${
                      active
                        ? "border-olive bg-bone shadow-sm"
                        : "border-line/60 bg-bone/60 hover:border-olive/60"
                    }`}
                    data-testid={`choose-service-${s.id}`}
                  >
                    <p className="overline mb-1">{s.category}</p>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif-display text-2xl text-ink">{s.name}</h3>
                      <div className="text-right shrink-0">
                        <div className="font-serif-display text-xl">${s.price}</div>
                        <div className="text-xs text-muted flex items-center gap-1 justify-end">
                          <Clock size={12} /> {s.duration_min}m
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted">{s.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div data-testid="step-stylist">
            <h2 className="font-serif-display text-3xl text-ink mb-6">Choose your stylist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stylists.map((s) => {
                const active = s.id === stylistId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStylistId(s.id)}
                    className={`text-left rounded-2xl overflow-hidden border transition-all ${
                      active
                        ? "border-olive shadow-sm bg-bone"
                        : "border-line/60 bg-bone/60 hover:border-olive/60"
                    }`}
                    data-testid={`choose-stylist-${s.id}`}
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="overline mb-1">{s.role}</p>
                      <h3 className="font-serif-display text-xl text-ink">{s.name}</h3>
                      <p className="mt-1 text-xs text-muted">
                        {s.specialties.join(" · ")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div data-testid="step-datetime" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-serif-display text-3xl text-ink mb-6">Pick a date</h2>
              <div className="bg-bone rounded-2xl border border-line/60 p-2 inline-block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setTime(null);
                  }}
                  disabled={(d) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return d < today || d.getDay() === 1; // closed Mondays
                  }}
                  data-testid="booking-calendar"
                />
              </div>
              <p className="text-xs text-muted mt-3">Closed Mondays.</p>
            </div>
            <div>
              <h2 className="font-serif-display text-3xl text-ink mb-6">Pick a time</h2>
              {!date && (
                <p className="text-muted text-sm">Select a date first.</p>
              )}
              {date && loadingSlots && (
                <p className="text-muted text-sm">Loading availability…</p>
              )}
              {date && !loadingSlots && (
                <div className="grid grid-cols-3 gap-2" data-testid="time-slots">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setTime(s.time)}
                      className={`py-2.5 rounded-full border text-sm transition-all ${
                        time === s.time
                          ? "bg-olive text-bone border-olive"
                          : s.available
                          ? "bg-bone border-line/60 hover:border-olive"
                          : "bg-stone/50 border-line/40 text-muted line-through cursor-not-allowed"
                      }`}
                      data-testid={`time-slot-${s.time}`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div data-testid="step-details" className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-4">
              <h2 className="font-serif-display text-3xl text-ink mb-2">Your details</h2>
              <input
                data-testid="details-name"
                type="text"
                placeholder="Full name"
                value={details.customer_name}
                onChange={(e) => setDetails({ ...details, customer_name: e.target.value })}
                className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 focus:outline-none focus:border-olive"
              />
              <input
                data-testid="details-email"
                type="email"
                placeholder="Email"
                value={details.customer_email}
                onChange={(e) => setDetails({ ...details, customer_email: e.target.value })}
                className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 focus:outline-none focus:border-olive"
              />
              <input
                data-testid="details-phone"
                type="tel"
                placeholder="Phone"
                value={details.customer_phone}
                onChange={(e) => setDetails({ ...details, customer_phone: e.target.value })}
                className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 focus:outline-none focus:border-olive"
              />
              <textarea
                data-testid="details-notes"
                placeholder="Anything we should know? (allergies, references, etc.)"
                rows={3}
                value={details.notes}
                onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 focus:outline-none focus:border-olive resize-none"
              />
            </div>
            <aside className="md:col-span-2 bg-bone rounded-2xl border border-line/60 p-6" data-testid="booking-summary">
              <p className="overline mb-4">Summary</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Service</span>
                  <span className="text-ink text-right">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Stylist</span>
                  <span className="text-ink text-right">{selectedStylist?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Date</span>
                  <span className="text-ink text-right">{date ? fmtDate(date) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Time</span>
                  <span className="text-ink text-right">{time || "—"}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-line/60 flex justify-between">
                  <span className="text-muted">Total</span>
                  <span className="font-serif-display text-2xl text-ink">
                    ${selectedService?.price ?? 0}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-2 text-xs text-muted">
                <Sparkles size={14} className="text-terracotta mt-0.5" />
                <span>You'll only be charged after your visit. Cancel free up to 24h before.</span>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => (step === 0 ? navigate("/") : setStep((s) => s - 1))}
          className="btn-secondary"
          data-testid="booking-back"
        >
          <ArrowLeft size={16} /> {step === 0 ? "Home" : "Back"}
        </button>
        {step < 3 ? (
          <button
            disabled={!canNext()}
            onClick={() => setStep((s) => s + 1)}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            data-testid="booking-next"
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            disabled={!canNext() || submitting}
            onClick={submit}
            className="btn-primary disabled:opacity-40"
            data-testid="booking-submit"
          >
            {submitting ? "Confirming..." : "Confirm appointment"}
          </button>
        )}
      </div>
    </div>
  );
}
