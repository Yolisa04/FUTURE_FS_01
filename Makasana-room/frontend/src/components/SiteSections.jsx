import { useState } from "react";
import { Star, Check } from "lucide-react";
import client from "../api/client";
import { toast } from "sonner";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhhaXJjdXR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1654097800183-574ba7368f74?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1743012394316-4606e330ef23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvbGQlMjBoZWFkfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1629189784191-9afdcbcb0398?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJhcmJlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1596362601603-b74f6ef166e4?q=80&w=726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export function Gallery() {
  return (
    <section id="gallery" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs tracking-[0.2em] uppercase text-ochre-600">Portfolio</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3 mb-4">Gallery</h2>
        <p className="text-ink/60">A few recent transformations, and a peek inside the studio.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_IMAGES.map((src, i) => (
          <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
            <img src={src} alt={`Makasana Room work ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Thabo M.", text: "Cleanest fade I've had in years. Kasi knows exactly where to blend before you even ask.", rating: 5 },
  { name: "Sipho N.", text: "Been coming here for my tapers for months now, never had to explain what I want anymore.", rating: 5 },
  { name: "Luyanda K.", text: "Booking online is so much easier than calling around. In and out with a sharp line-up every time.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="bg-ink text-cream py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs tracking-[0.2em] uppercase text-ochre-300">Client Love</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3">What People Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-cream/5 border border-cream/10 rounded-2xl p-6">
              <div className="flex gap-1 mb-3 text-ochre-300">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-cream/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="text-sm font-medium text-ochre-200">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PERKS = ["Priority booking access", "15% off every visit", "Complimentary birthday treatment", "Invites to exclusive salon events"];

export function Membership() {
  return (
    <section id="membership" className="max-w-6xl mx-auto px-6 py-24">
      <div className="bg-gradient-to-br from-ochre-600 to-ochre-800 rounded-3xl p-10 md:p-16 text-cream grid md:grid-cols-2 gap-10 items-center overflow-hidden relative">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-cream/10 blur-2xl" />
        <div className="relative">
          <span className="text-xs tracking-[0.2em] uppercase text-ochre-200">Makasana Membership</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3 mb-4">Become a Member</h2>
          <p className="text-cream/80 mb-6">
            For clients who visit often and want the little things taken care of automatically.
          </p>
          <a href="#contact" className="inline-block bg-cream text-ochre-800 px-7 py-3.5 rounded-full font-medium hover:bg-cream/90 transition-colors">
            Ask About Membership
          </a>
        </div>
        <ul className="relative space-y-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-3 bg-cream/10 rounded-xl px-4 py-3">
              <Check size={18} className="text-ochre-200 shrink-0" />
              <span className="text-sm">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/api/contact", form);
      toast.success("Message sent. We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong sending your message. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <span className="text-xs tracking-[0.2em] uppercase text-ochre-600">Get In Touch</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3">Questions? Send a Note</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white border border-ochre-100 rounded-2xl p-8 shadow-soft space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
          />
        </div>
        <textarea
          required
          placeholder="How can we help?"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-ochre-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ochre-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-ochre-600 hover:bg-ochre-700 disabled:opacity-60 text-cream px-7 py-3 rounded-full font-medium transition-colors"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
