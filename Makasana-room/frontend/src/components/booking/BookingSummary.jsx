import { CheckCircle2, Calendar, Clock, User, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingSummary({ service, stylist, date, time }) {
  return (
    <div className="border border-ochre-100 rounded-2xl p-6 bg-ochre-50/40 sticky top-24">
      <h3 className="font-display text-lg mb-4">Your Booking</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-ink/70">
          <Scissors size={15} className="text-ochre-600 shrink-0" />
          {service ? service.name : <span className="text-ink/40">No service selected</span>}
        </div>
        <div className="flex items-center gap-2 text-ink/70">
          <User size={15} className="text-ochre-600 shrink-0" />
          {stylist ? stylist.name : <span className="text-ink/40">No stylist selected</span>}
        </div>
        <div className="flex items-center gap-2 text-ink/70">
          <Calendar size={15} className="text-ochre-600 shrink-0" />
          {date || <span className="text-ink/40">No date selected</span>}
        </div>
        <div className="flex items-center gap-2 text-ink/70">
          <Clock size={15} className="text-ochre-600 shrink-0" />
          {time || <span className="text-ink/40">No time selected</span>}
        </div>
      </div>
      {service && (
        <div className="border-t border-ochre-200 mt-4 pt-4 flex justify-between text-sm font-medium">
          <span>Estimated total</span>
          <span className="text-ochre-700">R{service.price}</span>
        </div>
      )}
    </div>
  );
}

export function BookingConfirmed({ booking, service, stylist }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-ochre-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-ochre-600" />
      </div>
      <h1 className="font-display text-3xl mb-3">You're all set</h1>
      <p className="text-ink/60 mb-8">
        A confirmation has been sent to your email. We'll see you soon.
      </p>

      <div className="border border-ochre-100 rounded-2xl p-6 text-left space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">Confirmation #</span>
          <span className="font-medium">{booking.booking_ref}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">Service</span>
          <span className="font-medium">{service?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">Stylist</span>
          <span className="font-medium">{stylist?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">Date</span>
          <span className="font-medium">{booking.date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">Time</span>
          <span className="font-medium">{booking.time}</span>
        </div>
      </div>

      <Link to="/" className="inline-block bg-ochre-600 hover:bg-ochre-700 text-cream px-7 py-3.5 rounded-full font-medium transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
