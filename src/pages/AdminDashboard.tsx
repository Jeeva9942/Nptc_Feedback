import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import PrintReport from '@/components/PrintReport';
import { motion } from 'framer-motion';
import { getAnalytics, getFeedbackByDepartment, getStudents, addStudents } from '@/data/mockData';
import { Department, DEPARTMENTS, DEPARTMENT_NAMES, Student } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, CheckCircle, Clock, Building, Printer, Upload, Search } from 'lucide-react';

const CHART_COLORS = ['#1e5a9e', '#d4910d', '#16a34a', '#0891b2', '#7c3aed', '#e11d48'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedDept, setSelectedDept] = useState<Department | 'ALL'>('ALL');
  const [showPrint, setShowPrint] = useState(false);
  const [printDept, setPrintDept] = useState<Department>('CIVIL');
  const [searchRoll, setSearchRoll] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const analytics = getAnalytics();
  const students = getStudents();

  const filteredStudents = students.filter(s => {
    const matchDept = selectedDept === 'ALL' || s.department === selectedDept;
    const matchSearch = !searchRoll || s.rollNo.toLowerCase().includes(searchRoll.toLowerCase()) || s.name.toLowerCase().includes(searchRoll.toLowerCase());
    return matchDept && matchSearch;
  });

  const deptChartData = analytics.deptStats.map(d => ({
    name: d.department,
    submitted: d.submitted,
    pending: d.pending,
    avgFacility: d.facilityAvg,
    avgAccomplishment: d.accomplishmentAvg,
  }));

  const pieData = [
    { name: 'Submitted', value: analytics.submitted },
    { name: 'Pending', value: analytics.pending },
  ];

  const handlePrint = (dept: Department) => {
    setPrintDept(dept);
    setShowPrint(true);
    setTimeout(() => window.print(), 500);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // In a real app, parse Excel here. For demo, show alert.
    alert('Excel upload requires Lovable Cloud backend. Demo students are pre-loaded. Enable Cloud for full Excel parsing support.');
  };

  if (showPrint) {
    const feedback = getFeedbackByDepartment(printDept);
    return (
      <div>
        <div className="no-print p-4 bg-card border-b flex items-center gap-4">
          <button onClick={() => setShowPrint(false)} className="px-4 py-2 rounded-lg border text-foreground hover:bg-muted">← Back</button>
          <span className="text-sm text-muted-foreground">Press Ctrl+P to save as PDF</span>
        </div>
        <PrintReport department={printDept} feedback={feedback} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Students', value: analytics.total, icon: Users, color: 'text-primary' },
            { label: 'Submitted', value: analytics.submitted, icon: CheckCircle, color: 'text-success' },
            { label: 'Pending', value: analytics.pending, icon: Clock, color: 'text-accent' },
            { label: 'Departments', value: analytics.departments.length, icon: Building, color: 'text-info' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="stat-card bg-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={stat.color} size={32} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card rounded-2xl border p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Department-wise Submissions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submitted" fill="#1e5a9e" name="Submitted" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#d4910d" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl border p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Submission Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value as Department | 'ALL')}
            className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{DEPARTMENT_NAMES[d]}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchRoll}
              onChange={e => setSearchRoll(e.target.value)}
              placeholder="Search by roll no or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Upload Excel */}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
            <Upload size={16} />
            Upload Excel
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" />
          </label>

          {/* Print Reports */}
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => handlePrint(d)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Printer size={14} />
              {d}
            </button>
          ))}
        </div>

        {/* Students Table */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s.rollNo} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                    <td className="p-3 font-medium text-foreground">{s.rollNo}</td>
                    <td className="p-3 text-foreground">{s.name}</td>
                    <td className="p-3 text-foreground">{s.department}</td>
                    <td className="p-3 text-center">
                      {s.hasSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          <CheckCircle size={12} /> Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
