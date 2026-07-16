import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import client from "../api/client";
import StepService from "../components/booking/StepService";
import StepStylist from "../components/booking/StepStylist";
import StepDateTime from "../components/booking/StepDateTime";
import StepCustomer from "../components/booking/StepCustomer";
import { BookingSummary, BookingConfirmed } from "../components/booking/BookingSummary";

const STEPS = ["Service", "Stylist", "Date & Time", "Your Details"];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [service, setService] = useState(null);
  const [stylist, setStylist] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    Promise.all([client.get("/api/services"), client.get("/api/stylists")])
      .then(([svcRes, stylistRes]) => {
        setServices(svcRes.data);
        setStylists(stylistRes.data);
      })
      .catch(() => {
        toast.error("Couldn't load services right now. Please refresh the page.");
      })
      .finally(() => setLoadingData(false));
  }, []);

  // whenever the stylist or date changes, the previously chosen time may no longer be valid
  useEffect(() => {
    setTime(null);
  }, [stylist, date]);

  const canProceed = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!stylist;
    if (step === 2) return !!date && !!time;
    if (step === 3) {
      return customer.name.trim() && customer.email.trim() && customer.phone.trim();
    }
    return true;
  };

  const goNext = () => {
    if (!canProceed()) {
      if (step === 3) {
        const newErrors = {};
        if (!customer.name.trim()) newErrors.name = "Name is required";
        if (!customer.email.trim()) newErrors.email = "Email is required";
        if (!customer.phone.trim()) newErrors.phone = "Phone is required";
        setErrors(newErrors);
      }
      return;
    }
    setErrors({});
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await client.post("/api/bookings", {
        service_id: service.id,
        stylist_id: stylist.id,
        date,
        time,
        customer,
      });
      setConfirmedBooking(res.data);
      toast.success("Appointment booked!");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (err?.response?.status === 409) {
        toast.error(detail || "That slot was just taken. Please pick another time.");
        setStep(2);
      } else {
        toast.error(detail || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink/50 gap-2">
        <Loader2 className="animate-spin" size={18} /> Loading booking system…
      </div>
    );
  }

  if (confirmedBooking) {
    return <BookingConfirmed booking={confirmedBooking} service={service} stylist={stylist} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      {/* progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                i < step
                  ? "bg-ochre-600 text-cream"
                  : i === step
                  ? "bg-ochre-100 text-ochre-700 border-2 border-ochre-600"
                  : "bg-ochre-50 text-ink/30"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? "text-ink font-medium" : "text-ink/40"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-ochre-600" : "bg-ochre-100"}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {step === 0 && <StepService services={services} selected={service} onSelect={setService} />}
          {step === 1 && <StepStylist stylists={stylists} selected={stylist} onSelect={setStylist} />}
          {step === 2 && (
            <StepDateTime
              stylistId={stylist?.id}
              date={date}
              time={time}
              onSelectDate={setDate}
              onSelectTime={setTime}
            />
          )}
          {step === 3 && <StepCustomer customer={customer} onChange={setCustomer} errors={errors} />}

          <div className="flex justify-between mt-10">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-ink/60 hover:text-ink disabled:opacity-0 transition-opacity"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={goNext}
              disabled={!canProceed() || submitting}
              className="flex items-center gap-1 bg-ochre-600 hover:bg-ochre-700 disabled:opacity-50 text-cream px-6 py-3 rounded-full font-medium transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Booking…
                </>
              ) : step === STEPS.length - 1 ? (
                "Confirm Booking"
              ) : (
                <>
                  Continue <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-1">
          <BookingSummary service={service} stylist={stylist} date={date} time={time} />
        </div>
      </div>
    </div>
  );
}
