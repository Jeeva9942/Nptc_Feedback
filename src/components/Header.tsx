import { useAuth } from '@/context/AuthContext';
import { LogOut, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import nptcLogo from '@/assets/nptc-logo.webp';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="no-print">
      {/* Top dark bar - matches nptc.ac.in */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-1">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              91-4259-236030, 236040, 236050
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={13} />
              principal@nptc.ac.in
            </span>
          </div>
          {user && (
            <span className="text-primary-foreground/70 text-xs">
              {user.role === 'student' ? `${user.name} · ${user.rollNo}` : 'Administrator'}
            </span>
          )}
        </div>
      </div>

      {/* Main header - white with logo, matching nptc.ac.in style */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <img
              src={nptcLogo}
              alt="Nachimuthu Polytechnic College Logo"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-display font-bold text-primary leading-tight">
                Nachimuthu Polytechnic College
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-primary/80 leading-snug mt-0.5">
                Government Aided • Autonomous Institution • Approved by AICTE, New Delhi
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                Affiliated to State Board of Technical Education & Training, Tamilnadu
              </p>
              <p className="text-[9px] sm:text-[11px] text-muted-foreground italic">
                (A Division of NIA Educational Institutions)
              </p>
            </div>
          </div>

          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border border-border hover:bg-muted text-foreground text-xs sm:text-sm transition-colors flex-shrink-0"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </motion.header>
    </div>
  );
}
