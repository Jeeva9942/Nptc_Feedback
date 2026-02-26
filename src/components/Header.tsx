import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="college-header no-print"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center font-display text-xl font-bold text-primary-foreground">
            NPC
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold text-primary-foreground">
              Nachimuthu Polytechnic College
            </h1>
            <p className="text-xs md:text-sm text-primary-foreground/70">
              Aided Autonomous Institute · Estd: 1957
            </p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-primary-foreground">
                {user.role === 'student' ? user.name : 'Administrator'}
              </p>
              <p className="text-xs text-primary-foreground/70">
                {user.role === 'student' ? `${user.rollNo} · ${user.department}` : 'Admin Panel'}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-sm transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
