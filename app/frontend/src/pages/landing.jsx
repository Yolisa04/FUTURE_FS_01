import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Scissors, Leaf, Star } from "lucide-react";
import { getServices, getStylists, sendContact } from "@/lib/api";
import { toast } from "sonner";

const HERO_IMG =
  "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwzfHx1cHNjYWxlJTIwc2Fsb24lMjBpbnRlcmlvciUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3ODI5OTE3NzJ8MA&ixlib=rb-4.1.0&q=85";

const GALLERY = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80",
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    quote:
      "Mira gave me the first haircut I've truly loved in a decade. The whole experience felt like a slow exhale.",
    avatar:
      "https://images.unsplash.com/photo-1611451444023-7fe9d86fe1d0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHBvcnRyYWl0JTIwbmF0dXJhbCUyMGxpZ2h0JTIwbmV1dHJhbHxlbnwwfHx8fDE3ODI5OTE3NzJ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    name: "Elena R.",
    quote:
      "Booking online was effortless and the balayage grew out beautifully. Ochre Room set a new standard for me.",
    avatar:
      "https://images.unsplash.com/photo-1552699611-e2c208d5d9cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwbmF0dXJhbCUyMGxpZ2h0JTIwbmV1dHJhbHxlbnwwfHx8fDE3ODI5OTE3NzJ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    name: "Marcus T.",
    quote:
      "Jonas cuts my hair like an architect. The space smells like eucalyptus and quiet money. I never want to leave.",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Landing() {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
    getStylists().then(setStylists).catch(() => {});
  }, []);

  const submitContact = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      await sendContact(contact);
      toast.success("Message received. We'll be in touch shortly.");
      setContact({ name: "", email: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="landing-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-14 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-6 animate-fade-up">
            <p className="overline mb-6" data-testid="hero-overline">
              A neighborhood salon · Est. 2016
            </p>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-ink">
              Softly rebellious
              <br />
              <span className="italic text-terracotta">hair &amp; skin</span>
              <br />
              rituals.
            </h1>
            <p className="mt-6 max-w-md text-muted text-base leading-relaxed">
              Ochre Room is a light-filled studio on Valencia where quiet
              craftsmanship, plant-forward products, and honest conversation
              come together — for hair you'll still love in six weeks.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/book" className="btn-primary" data-testid="hero-book-cta">
                Book an appointment <ArrowUpRight size={16} />
              </Link>
              <a href="#services" className="btn-secondary" data-testid="hero-services-cta">
                Explore services
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-terracotta text-terracotta" />
                ))}
                <span className="ml-2 text-ink">4.9 · Yelp</span>
              </div>
              <span className="hidden sm:inline">1,200+ happy regulars</span>
            </div>
          </div>

          <div className="md:col-span-6 relative">
            <div className="relative hover-image rounded-[28px] overflow-hidden aspect-[4/5] shadow-[0_30px_60px_-30px_rgba(44,51,46,0.35)]">
              <img
                src={HERO_IMG}
                alt="Ochre Room interior"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 bg-bone border border-line/70 rounded-full px-5 py-3 shadow-md">
              <Leaf size={16} className="text-olive" />
              <span className="text-xs tracking-wide">Certified sustainable products</span>
            </div>
          </div>
        </div>

        {/* Editorial ribbon marquee */}
        <div className="border-y border-line/60 bg-stone/60 overflow-hidden">
          <div className="marquee-track py-4 whitespace-nowrap text-ink/70 font-serif-display text-2xl">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-16 pr-16">
                {["Oribe", "Davines", "Olaplex", "Aveda", "Kevin Murphy", "R+Co", "Rahua"].map(
                  (b) => (
                    <span key={`${k}-${b}`} className="italic tracking-tight">
                      {b}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-14">
          <div className="md:col-span-7">
            <p className="overline mb-3">The Menu</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight text-ink">
              Services designed to
              <br />
              <span className="italic text-terracotta">last longer than a season.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-muted leading-relaxed">
              Every appointment begins with a fifteen-minute consultation. We
              only recommend what will grow out beautifully — no upsells, no
              pressure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" data-testid="services-grid">
          {services.map((s, i) => (
            <article
              key={s.id}
              className={`group relative bg-stone/70 border border-line/60 rounded-2xl overflow-hidden hover-image ${
                i % 5 === 0 ? "md:col-span-7" : "md:col-span-5"
              } ${i % 5 === 3 ? "md:col-span-8" : ""} ${i % 5 === 4 ? "md:col-span-4" : ""}`}
              data-testid={`service-card-${s.id}`}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex items-start justify-between gap-6">
                <div>
                  <p className="overline mb-1">{s.category}</p>
                  <h3 className="font-serif-display text-2xl text-ink leading-tight">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted max-w-sm">{s.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-serif-display text-2xl text-ink">${s.price}</div>
                  <div className="text-xs text-muted">{s.duration_min} min</div>
                </div>
              </div>
              <Link
                to="/book"
                state={{ serviceId: s.id }}
                className="absolute top-4 right-4 bg-bone/90 backdrop-blur border border-line/60 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Book ${s.name}`}
                data-testid={`service-book-${s.id}`}
              >
                <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="bg-stone/40 border-y border-line/60 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <p className="overline mb-3">The Room</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-ink leading-[1] tracking-tight">
                Four hands.
                <br />
                <span className="italic text-terracotta">Twenty-two years of listening.</span>
              </h2>
            </div>
            <Link to="/book" className="btn-secondary" data-testid="team-book-cta">
              Book with a stylist
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="team-grid">
            {stylists.map((s) => (
              <article
                key={s.id}
                className="group bg-bone rounded-2xl overflow-hidden border border-line/60 hover-image"
                data-testid={`stylist-card-${s.id}`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="overline mb-1">{s.role}</p>
                  <h3 className="font-serif-display text-2xl text-ink">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted">{s.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.specialties.slice(0, 3).map((sp) => (
                      <span
                        key={sp}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-line text-muted"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="mb-12">
          <p className="overline mb-3">Lookbook</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-ink leading-[1] tracking-tight max-w-2xl">
            Recent work from the chair.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4" data-testid="gallery-grid">
          {GALLERY.map((src, i) => {
            const spans = [
              "md:col-span-5 md:row-span-2 aspect-[4/5]",
              "md:col-span-4 aspect-[4/3]",
              "md:col-span-3 aspect-[3/4]",
              "md:col-span-4 aspect-[4/3]",
              "md:col-span-3 aspect-[3/4]",
              "md:col-span-5 aspect-[16/10]",
            ];
            return (
              <div
                key={i}
                className={`hover-image rounded-2xl overflow-hidden ${spans[i]}`}
                data-testid={`gallery-item-${i}`}
              >
                <img src={src} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-stone/40 border-y border-line/60 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="overline mb-3">Guest Notes</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-ink leading-[1] tracking-tight max-w-3xl mb-14">
            Words from our regulars.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="testimonials">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={i}
                className="bg-bone border border-line/60 rounded-2xl p-8 flex flex-col gap-6"
                data-testid={`testimonial-${i}`}
              >
                <Sparkles size={18} className="text-terracotta" />
                <p className="font-serif-display text-xl leading-snug text-ink">
                  "{t.quote}"
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm text-ink">{t.name}</div>
                    <div className="text-xs text-muted">Verified guest</div>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP + CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-6 relative bg-olive text-bone rounded-3xl p-10 md:p-14 overflow-hidden">
          <Scissors size={22} className="text-terracotta" />
          <h3 className="font-serif-display text-4xl sm:text-5xl mt-6 leading-[1.05] tracking-tight">
            The Ochre Circle
          </h3>
          <p className="mt-4 text-bone/85 max-w-md leading-relaxed">
            Our membership: two blowouts a month, 15% off color services, and
            priority booking on weekends. $89/mo. Cancel anytime.
          </p>
          <Link
            to="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-bone text-ink px-7 py-3 text-sm font-medium hover:bg-terracotta hover:text-bone transition-colors"
            data-testid="membership-cta"
          >
            Join the circle <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="md:col-span-6">
          <p className="overline mb-3">Say hi</p>
          <h3 className="font-serif-display text-4xl sm:text-5xl text-ink leading-[1] tracking-tight">
            Questions before you book?
          </h3>
          <form onSubmit={submitContact} className="mt-8 space-y-4" data-testid="contact-form">
            <input
              data-testid="contact-name"
              type="text"
              placeholder="Your name"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 text-ink placeholder:text-muted focus:outline-none focus:border-olive"
            />
            <input
              data-testid="contact-email"
              type="email"
              placeholder="Email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 text-ink placeholder:text-muted focus:outline-none focus:border-olive"
            />
            <textarea
              data-testid="contact-message"
              placeholder="What are you thinking about?"
              rows={4}
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
              className="w-full bg-bone border border-line/70 rounded-xl px-5 py-3.5 text-ink placeholder:text-muted focus:outline-none focus:border-olive resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-60"
              data-testid="contact-submit"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
