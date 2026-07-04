import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const nav = [
    { to: "/", label: "Home", end: true },
    { to: "/#services", label: "Services" },
    { to: "/#team", label: "Team" },
    { to: "/#gallery", label: "Gallery" },
    { to: "/pitch", label: "The Pitch" },
  ];

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-bone/85 border-b border-line/50" : "bg-bone/60 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
        <Link to="/" data-testid="header-logo" className="flex items-baseline gap-2">
          <span className="font-serif-display text-3xl leading-none tracking-tight text-ink">
            Ochre
          </span>
          <span className="font-serif-display italic text-3xl leading-none tracking-tight text-terracotta">
            Room
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/book"
            data-testid="header-book-cta"
            className="btn-primary hidden sm:inline-flex"
          >
            Book Appointment
          </Link>
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 -mr-2 text-ink"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line/60 bg-bone/95 backdrop-blur-xl">
          <div className="px-6 py-5 flex flex-col gap-4">
            {nav.map((n) => (
              <a
                key={n.to}
                href={n.to}
                className="text-ink text-base"
                data-testid={`mobile-nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {n.label}
              </a>
            ))}
            <Link to="/book" className="btn-primary self-start" data-testid="mobile-book-cta">
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;