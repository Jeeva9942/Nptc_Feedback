import { useAuth } from '@/context/AuthContext';
import { LogOut, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import nptcLogo from '@/assets/nptc-logo.webp';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="no-print">
      {/* Top dark bar */}
      <div className="bg-foreground text-background text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={11} />
              91-4259-236030, 236040
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Mail size={11} />
              principal@nptc.ac.in
            </span>
          </div>
          {user && (
            <span className="text-muted-foreground">
              {user.role === 'student' ? `${user.name} · ${user.rollNo}` : 'Administrator'}
            </span>
          )}
        </div>
      </div>

      {/* Main header - white with logo */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={nptcLogo}
              alt="Nachimuthu Polytechnic College Logo"
              className="h-14 w-auto object-contain"
            />
            <div>
              <h1 className="text-base md:text-lg font-display font-bold text-foreground leading-tight">
                Nachimuthu Polytechnic College
              </h1>
              <p className="text-[11px] md:text-xs text-muted-foreground">
                (Aided Autonomous Institution) · Pollachi · Estd: 1957
              </p>
              <p className="text-[10px] md:text-[11px] text-accent font-semibold">
                Exit Survey Feedback System
              </p>
            </div>
          </div>

          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted text-foreground text-sm transition-colors"
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
