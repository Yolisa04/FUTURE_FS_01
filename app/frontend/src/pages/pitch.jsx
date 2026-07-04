import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock, Instagram, Star } from "lucide-react";

const metrics = [
  { label: "24/7 online bookings", detail: "Convert Instagram traffic into paying appointments at 2am." },
  { label: "~18h/week saved", detail: "No more back-and-forth DMs and phone tag for the front desk." },
  { label: "+22% avg. ticket", detail: "Menu-style service presentation upsells add-ons naturally." },
  { label: "Owner dashboard", detail: "A single screen for today's schedule, cancellations & no-shows." },
];

export default function Pitch() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-16" data-testid="pitch-page">
      <p className="overline mb-4">The Pitch</p>
      <h1 className="font-serif-display text-5xl sm:text-6xl leading-[0.98] tracking-tight text-ink">
        A website that pays for itself in <span className="italic text-terracotta">under a month</span>.
      </h1>
      <p className="mt-6 text-muted text-lg leading-relaxed">
        Ochre Room is a fictional but realistic upscale neighborhood salon in
        San Francisco — built as a live demo to pitch to a real local salon
        owner. The goal isn't just a "pretty site" — it's a growth tool that
        does three specific things for the business:
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-stone/60 border border-line/60 rounded-2xl p-6"
            data-testid={`pitch-metric-${m.label.toLowerCase().replace(/\W+/g, "-")}`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-olive" />
              <div className="font-serif-display text-2xl text-ink">{m.label}</div>
            </div>
            <p className="mt-2 text-sm text-muted">{m.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 space-y-8 text-ink/90 leading-relaxed">
        <section>
          <h2 className="font-serif-display text-3xl text-ink mb-3">1 · Capture bookings around the clock</h2>
          <p className="text-muted">
            Most salons still take bookings by phone or DM. Every missed call
            after 6pm is a lost customer. This site includes a four-step
            progressive booking flow (service → stylist → date & time → your
            details) that converts visitors while your team is home. Behind the
            scenes, a FastAPI + MongoDB backend prevents double-bookings and
            stores everything in a live database.
          </p>
        </section>
        <section>
          <h2 className="font-serif-display text-3xl text-ink mb-3">2 · Turn Instagram followers into regulars</h2>
          <p className="text-muted">
            An editorial layout, real photography, and named stylist profiles
            build the trust that drives someone to try a new salon. The site is
            designed to be the natural landing spot from an Instagram bio link —
            with clear pricing, honest bios, and a friction-free path to book.
          </p>
        </section>
        <section>
          <h2 className="font-serif-display text-3xl text-ink mb-3">3 · Give the owner control</h2>
          <p className="text-muted">
            A simple <Link to="/admin" className="text-terracotta hover:underline">admin dashboard</Link>{" "}
            shows today's appointments, running totals, and one-click cancel.
            The owner replaces a paper calendar with a live view — from any
            phone, anywhere.
          </p>
        </section>
      </div>

      <div className="mt-14 p-8 md:p-10 rounded-3xl bg-olive text-bone">
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="fill-terracotta text-terracotta" />
          ))}
          <span className="text-bone/80 text-sm">Ready-to-pitch demo</span>
        </div>
        <h3 className="font-serif-display text-4xl leading-tight">
          Try the flows below. This is the exact site a real owner would see.
        </h3>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-bone text-ink px-7 py-3 text-sm font-medium hover:bg-terracotta hover:text-bone transition-colors" data-testid="pitch-book-cta">
            Try booking flow <ArrowRight size={16} />
          </Link>
          <Link to="/admin" className="inline-flex items-center gap-2 rounded-full border border-bone/40 text-bone px-7 py-3 text-sm font-medium hover:bg-bone/10 transition-colors" data-testid="pitch-admin-cta">
            Open admin dashboard
          </Link>
        </div>
        <div className="mt-6 flex items-center gap-4 text-sm text-bone/70">
          <span className="inline-flex items-center gap-1"><Clock size={14} /> Built in a weekend</span>
          <span className="inline-flex items-center gap-1"><Instagram size={14} /> IG-ready landing</span>
        </div>
      </div>
    </div>
  );
}
