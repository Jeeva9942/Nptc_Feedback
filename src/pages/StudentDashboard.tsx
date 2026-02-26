import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStudentByRollNo } from '@/data/mockData';
import Header from '@/components/Header';
import FeedbackForm from '@/components/FeedbackForm';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { CheckCircle, User, BookOpen, Building } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (user?.rollNo) {
      const student = getStudentByRollNo(user.rollNo);
      if (student?.hasSubmitted) setHasSubmitted(true);
    }
  }, [user]);

  if (!user || user.role !== 'student') return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Student Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-2xl border p-6 mb-8 card-elevated"
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="text-primary" size={28} />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Student Name</p>
                <p className="font-semibold text-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen size={12} /> Roll Number</p>
                <p className="font-semibold text-foreground">{user.rollNo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Building size={12} /> Department</p>
                <p className="font-semibold text-foreground">{user.department}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {hasSubmitted ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16 bg-card rounded-2xl border">
            <CheckCircle className="mx-auto mb-4 text-success" size={64} />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Feedback Already Submitted</h2>
            <p className="text-muted-foreground">You have already submitted your exit survey feedback. Thank you!</p>
          </motion.div>
        ) : (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="bg-card rounded-2xl border p-6">
              <h2 className="text-xl font-display font-bold text-foreground mb-2">Exit Survey Feedback Form</h2>
              <p className="text-sm text-muted-foreground mb-6">Term: VI · Academic Year 2024-2025</p>
              <FeedbackForm
                rollNo={user.rollNo!}
                studentName={user.name!}
                department={user.department!}
                onSubmitted={() => setHasSubmitted(true)}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
