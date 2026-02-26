import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [rollNo, setRollNo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    await new Promise(r => setTimeout(r, 500)); // Simulate loading
    
    const err = login({
      role,
      rollNo: role === 'student' ? rollNo : undefined,
      username: role === 'admin' ? username : undefined,
      password,
    });

    setIsLoading(false);

    if (err) {
      setError(err);
    } else {
      navigate(role === 'student' ? '/student' : '/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="college-header py-8 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-primary-foreground">NPC</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">
            Nachimuthu Polytechnic College
          </h1>
          <p className="text-primary-foreground/70 mt-1 text-sm">
            Aided Autonomous Institute · Approved by AICTE, New Delhi
          </p>
          <p className="text-primary-foreground/70 text-sm">
            Accredited by APACC with Gold Level
          </p>
          <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10">
            <span className="text-primary-foreground font-medium text-sm">
              📝 Exit Survey Feedback Portal
            </span>
          </div>
        </motion.div>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border shadow-lg overflow-hidden">
            {/* Role Tabs */}
            <div className="flex border-b">
              {(['student', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative ${
                    role === r
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r === 'student' ? <GraduationCap size={18} /> : <Shield size={18} />}
                  {r === 'student' ? 'Student Login' : 'Admin Login'}
                  {role === r && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                key={role}
                initial={{ opacity: 0, x: role === 'student' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {role === 'student' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Roll Number</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={e => setRollNo(e.target.value.toUpperCase())}
                      placeholder="e.g., 23CE01"
                      className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Enter admin username"
                      className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                )}
              </motion.div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={role === 'student' ? 'Default: your Roll Number' : 'Enter password'}
                    className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-college rounded-lg disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              {role === 'student' && (
                <p className="text-xs text-center text-muted-foreground">
                  Default password is your Roll Number
                </p>
              )}
              {role === 'admin' && (
                <p className="text-xs text-center text-muted-foreground">
                  Demo: admin / admin123
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
