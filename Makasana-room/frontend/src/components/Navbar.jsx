import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Team", href: "/#team" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Membership", href: "/#membership" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-wide text-ochre-800">
          Makasana's Barber
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ochre-600 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/booking"
            className="bg-ochre-600 hover:bg-ochre-700 text-cream px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Book Appointment
          </Link>
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-cream border-t border-ochre-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-ink/80 hover:text-ochre-600">
              {l.label}
            </a>
          ))}
          <Link to="/booking" className="bg-ochre-600 text-cream text-center px-5 py-2.5 rounded-full">
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}
