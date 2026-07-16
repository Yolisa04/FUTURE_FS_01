import { Link } from "react-router-dom";
import { AtSign, Share2, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/90 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl text-ochre-200 mb-3">Makasana Barber</h3>
          <p className="text-sm text-cream/60 leading-relaxed">
            Modern beauty, thoughtful care, and exceptional service, in the heart of the neighborhood.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" aria-label="Instagram" className="hover:text-ochre-300 transition-colors"><AtSign size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-ochre-300 transition-colors"><Share2 size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-cream">Explore</h4>
          <ul className="text-sm space-y-2 text-cream/60">
            <li><a href="/#services" className="hover:text-ochre-300">Services</a></li>
            <li><a href="/#team" className="hover:text-ochre-300">Team</a></li>
            <li><a href="/#membership" className="hover:text-ochre-300">Membership</a></li>
            <li><Link to="/booking" className="hover:text-ochre-300">Book Appointment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-cream">Company</h4>
          <ul className="text-sm space-y-2 text-cream/60">
            <li><Link to="/pitch" className="hover:text-ochre-300">For Salon Owners</Link></li>
            <li><Link to="/admin/login" className="hover:text-ochre-300">Admin Login</Link></li>
            <li><a href="/#contact" className="hover:text-ochre-300">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-cream">Visit</h4>
          <ul className="text-sm space-y-3 text-cream/60">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-ochre-300 shrink-0" /> CPUT Bellville Campus, Symphony Way, Bellville South, Cape Town, 7530</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-ochre-300 shrink-0" /> (071) 234-8765</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-ochre-300 shrink-0" /> kasithebarber@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 text-center text-xs text-cream/40 py-5">
        © {new Date().getFullYear()} Makasana Room. All rights reserved.
      </div>
    </footer>
  );
}
