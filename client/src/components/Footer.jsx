import React from 'react';
import { Heart, MapPin, Phone, Mail, Clock, Award } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-ink text-white/90 pt-16 pb-12 border-t border-ink/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🧁</span>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Bake<span className="text-accent">Ease</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Mumbai's premier artisanal bakery crafting authentic French viennoiserie, slow-fermented sourdoughs, and handcrafted bespoke celebration cakes since 2026.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-amber-300 font-medium">
              <Award className="w-4 h-4 text-accent" />
              <span>UN SDG 8 · Decent Work & Economic Growth</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Explore Menu</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-accent transition-colors">
                  Artisanal Cakes & Cheesecakes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-accent transition-colors">
                  Velvet Cupcakes Box
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-accent transition-colors">
                  French Croissants & Pastries
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-accent transition-colors">
                  Natural Leaven Sourdoughs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('custom')} className="hover:text-accent transition-colors">
                  Build Your Dream Cake Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('game')} className="hover:text-accent transition-colors">
                  BakeMaster Arcade Game
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Pickup */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Bakery Hours</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Monday – Friday</p>
                  <p className="text-xs text-white/60">7:00 AM – 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Saturday – Sunday</p>
                  <p className="text-xs text-white/60">8:00 AM – 10:00 PM</p>
                </div>
              </li>
              <li className="text-xs text-accent/90 pt-1">
                ⚡ Fresh hot batches baked daily at 6:30 AM & 3:00 PM
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-semibold text-lg">Visit Us</h4>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                <span>122 Artisan Lane, Near Pali Hill, Bandra West, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>hello@bakeease.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 BakeEase Platform · Built with MERN Stack (MongoDB, Express, React, Node.js).</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('contact')} className="hover:text-white">Privacy Policy</button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-white">Terms of Service</button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-white">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
