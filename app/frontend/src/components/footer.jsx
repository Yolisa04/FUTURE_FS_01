import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="mt-24 border-t border-line/70 bg-stone/40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-4xl text-ink">Ochre</span>
            <span className="font-serif-display italic text-4xl text-terracotta">Room</span>
          </div>
          <p className="mt-4 text-muted max-w-md leading-relaxed">
            A quiet, plant-forward salon in the Mission District — where thoughtful
            craft meets lived-in style. Since 2016.
          </p>
          <Link to="/book" className="btn-primary mt-6" data-testid="footer-book-cta">
            Reserve your seat
          </Link>
        </div>

        <div className="md:col-span-3">
          <p className="overline mb-4">Visit</p>
          <ul className="space-y-3 text-ink/90 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-1 text-terracotta" />
              <span>418 Valencia Street<br />San Francisco, CA 94103</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-terracotta" /> (415) 555-0184
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-terracotta" /> hello@ochreroom.co
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="overline mb-4">Hours</p>
          <ul className="space-y-2 text-sm text-ink/90">
            <li>Tue–Fri · 10a–8p</li>
            <li>Saturday · 9a–6p</li>
            <li>Sunday · 10a–5p</li>
            <li className="text-muted">Monday · Closed</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="overline mb-4">Follow</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ink/90 hover:text-terracotta"
            data-testid="footer-instagram"
          >
            <Instagram size={16} /> @ochreroom
          </a>
          <Link
            to="/admin"
            className="block mt-6 text-xs text-muted hover:text-ink"
            data-testid="footer-admin-link"
          >
            Staff · Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-xs text-muted flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Ochre Room. Handcrafted in San Francisco.</span>
          <span>Built as a client pitch demo · Portfolio project</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;