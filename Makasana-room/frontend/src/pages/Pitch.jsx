import { Link } from "react-router-dom";
import { TrendingUp, Clock, Users, ShieldCheck, Smartphone, Mail } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: TrendingUp,
    title: "More Bookings, Fewer No-Shows",
    text: "Automated reminders and optional deposits mean fewer empty chairs on your calendar.",
  },
  {
    icon: Clock,
    title: "Hours Back Every Week",
    text: "No more juggling DMs and phone calls. Clients book themselves, any time of day.",
  },
  {
    icon: Users,
    title: "One Place for Every Client",
    text: "Every booking, contact, and note lives in a single dashboard instead of scattered chats.",
  },
  {
    icon: ShieldCheck,
    title: "No Double Bookings",
    text: "The availability engine checks every stylist's real schedule before a slot is ever offered.",
  },
  {
    icon: Smartphone,
    title: "Looks Great Everywhere",
    text: "A fast, modern booking experience on phone, tablet, or desktop, no app download needed.",
  },
  {
    icon: Mail,
    title: "Automatic Follow-Up",
    text: "Confirmation and reminder emails and texts go out without you lifting a finger.",
  },
];

export default function Pitch() {
  return (
    <div>
      <section className="bg-gradient-to-br from-ochre-50 via-cream to-ochre-100 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-ochre-700 bg-white/70 px-4 py-1.5 rounded-full mb-6">
            For Salon &amp; Studio Owners
          </span>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            Run your salon like the business it deserves to be.
          </h1>
          <p className="text-ink/70 text-lg max-w-2xl mx-auto mb-10">
            Makasana Room replaces the DMs, sticky notes, and missed calls with one booking system built specifically for independent salons and barbershops.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="bg-ochre-600 hover:bg-ochre-700 text-cream px-7 py-3.5 rounded-full font-medium transition-colors">
              See It In Action
            </Link>
            <Link to="/admin/login" className="border border-ochre-300 hover:border-ochre-500 text-ink px-7 py-3.5 rounded-full font-medium transition-colors">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-ochre-100 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-ochre-100 flex items-center justify-center mb-4">
                <Icon size={20} className="text-ochre-700" />
              </div>
              <h3 className="font-medium text-lg mb-2">{title}</h3>
              <p className="text-sm text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream py-24">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="font-display text-3xl md:text-4xl mb-4">Ready to see it running your salon?</h2>
          <p className="text-cream/70 mb-8">
            Walk through a real booking, then check the admin dashboard to see how it looks from your side.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="bg-ochre-500 hover:bg-ochre-600 text-cream px-7 py-3.5 rounded-full font-medium transition-colors">
              Book Appointment
            </Link>
            <Link to="/admin/login" className="border border-cream/30 hover:border-cream/60 text-cream px-7 py-3.5 rounded-full font-medium transition-colors">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
