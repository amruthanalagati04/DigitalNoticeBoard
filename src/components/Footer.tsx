import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="p-1 bg-white rounded-lg inline-flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/src/assets/images/lbrce_official_logo.png"
                  alt="LBRCE Logo"
                  className="w-9 h-11 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold tracking-tight text-base">LBRCE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lakireddy Bali Reddy College of Engineering (Autonomous) — Official centralized digital notice board for academic circulars, exam notifications, and campus bulletins.
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Notice Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/notices?category=Academic" className="hover:text-white transition-colors">Academic Circulars</Link></li>
              <li><Link to="/notices?category=Examination" className="hover:text-white transition-colors">Examination Schedules</Link></li>
              <li><Link to="/notices?category=Placement" className="hover:text-white transition-colors">Placements & Careers</Link></li>
              <li><Link to="/notices?category=Events" className="hover:text-white transition-colors">Campus Events & Tech Fests</Link></li>
              <li><Link to="/notices?category=General" className="hover:text-white transition-colors">General Administration</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Portal Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home Portal</Link></li>
              <li><Link to="/notices" className="hover:text-white transition-colors">All Notices Archive</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Faculty & Staff Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">New Student Portal Access</Link></li>
              <li>
                <a
                  href="/api/download-zip"
                  download="lbrce-digital-notice-board.zip"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Download Project (.ZIP)</span>
                  <span className="text-[10px] text-slate-400">↓</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-2.5 text-xs text-slate-400">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Campus Desk</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Mylavaram, Krishna District, Andhra Pradesh - 521230</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>notices@lbrce.ac.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>08659-222933 / 222934</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LBRCE. Digital Notice Board System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Use</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 transition-colors">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
