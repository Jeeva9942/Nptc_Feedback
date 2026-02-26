import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getStudentByRollNo, validateAdmin, initializeData } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (credentials: { rollNo?: string; username?: string; password: string; role: 'student' | 'admin' }) => string | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const saved = localStorage.getItem('npc_current_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const login = (credentials: { rollNo?: string; username?: string; password: string; role: 'student' | 'admin' }): string | null => {
    if (credentials.role === 'student') {
      const student = getStudentByRollNo(credentials.rollNo || '');
      if (!student) return 'Invalid Roll Number';
      if (student.password !== credentials.password) return 'Invalid Password';
      const u: User = { role: 'student', rollNo: student.rollNo, name: student.name, department: student.department };
      setUser(u);
      localStorage.setItem('npc_current_user', JSON.stringify(u));
      return null;
    } else {
      if (!validateAdmin(credentials.username || '', credentials.password)) return 'Invalid Admin Credentials';
      const u: User = { role: 'admin', username: credentials.username };
      setUser(u);
      localStorage.setItem('npc_current_user', JSON.stringify(u));
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('npc_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
