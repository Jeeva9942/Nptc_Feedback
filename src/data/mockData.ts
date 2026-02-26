import { Student, FeedbackSubmission, Department } from '@/types';

const DEMO_STUDENTS: Student[] = [
  { rollNo: '23CE01', name: 'ADITHYA P', department: 'CIVIL', dob: '05/04/2007', password: '23CE01', hasSubmitted: false },
  { rollNo: '23CE02', name: 'ANBALAGAN M', department: 'CIVIL', dob: '24/11/2007', password: '23CE02', hasSubmitted: false },
  { rollNo: '23ME01', name: 'ARUN KUMAR S', department: 'MECH', dob: '12/03/2007', password: '23ME01', hasSubmitted: false },
  { rollNo: '23ME02', name: 'BALA MURUGAN K', department: 'MECH', dob: '15/06/2007', password: '23ME02', hasSubmitted: false },
  { rollNo: '23EE01', name: 'DHARANI R', department: 'EEE', dob: '20/01/2007', password: '23EE01', hasSubmitted: false },
  { rollNo: '23EC01', name: 'GOWTHAM S', department: 'ECE', dob: '08/09/2007', password: '23EC01', hasSubmitted: false },
  { rollNo: '23CS01', name: 'HARISH V', department: 'CSE', dob: '11/11/2007', password: '23CS01', hasSubmitted: false },
  { rollNo: '23CS02', name: 'KARTHIK R', department: 'CSE', dob: '03/07/2007', password: '23CS02', hasSubmitted: false },
  { rollNo: '23IT01', name: 'LOKESH M', department: 'IT', dob: '22/04/2007', password: '23IT01', hasSubmitted: false },
  { rollNo: '23IT02', name: 'NAVEEN K', department: 'IT', dob: '19/12/2007', password: '23IT02', hasSubmitted: false },
];

// Storage keys
const STUDENTS_KEY = 'npc_students';
const FEEDBACK_KEY = 'npc_feedback';
const ADMIN_KEY = 'npc_admin';

// Initialize
export function initializeData() {
  if (!localStorage.getItem(STUDENTS_KEY)) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(DEMO_STUDENTS));
  }
  if (!localStorage.getItem(FEEDBACK_KEY)) {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(ADMIN_KEY)) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify({ username: 'admin', password: 'admin123' }));
  }
}

export function getStudents(): Student[] {
  return JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
}

export function getStudentByRollNo(rollNo: string): Student | undefined {
  return getStudents().find(s => s.rollNo.toLowerCase() === rollNo.toLowerCase());
}

export function markStudentSubmitted(rollNo: string) {
  const students = getStudents();
  const idx = students.findIndex(s => s.rollNo.toLowerCase() === rollNo.toLowerCase());
  if (idx !== -1) {
    students[idx].hasSubmitted = true;
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }
}

export function addStudents(newStudents: Student[]) {
  const existing = getStudents();
  const rollNos = new Set(existing.map(s => s.rollNo.toLowerCase()));
  const toAdd = newStudents.filter(s => !rollNos.has(s.rollNo.toLowerCase()));
  localStorage.setItem(STUDENTS_KEY, JSON.stringify([...existing, ...toAdd]));
}

export function getFeedback(): FeedbackSubmission[] {
  return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
}

export function submitFeedback(feedback: FeedbackSubmission) {
  const all = getFeedback();
  all.push(feedback);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
  markStudentSubmitted(feedback.rollNo);
}

export function getFeedbackByDepartment(dept: Department): FeedbackSubmission[] {
  return getFeedback().filter(f => f.department === dept);
}

export function validateAdmin(username: string, password: string): boolean {
  const admin = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
  return admin.username === username && admin.password === password;
}

export function getAnalytics() {
  const students = getStudents();
  const feedback = getFeedback();
  const departments = [...new Set(students.map(s => s.department))] as Department[];

  const total = students.length;
  const submitted = students.filter(s => s.hasSubmitted).length;
  const pending = total - submitted;

  const deptStats = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const deptFeedback = feedback.filter(f => f.department === dept);
    const deptSubmitted = deptStudents.filter(s => s.hasSubmitted).length;

    // Average ratings for facilities
    let facilityAvg = 0;
    let accomplishmentAvg = 0;
    if (deptFeedback.length > 0) {
      const facilityRatings = deptFeedback.flatMap(f => f.answers.filter(a => a.section === 'facilities').map(a => a.rating));
      const accomplishmentRatings = deptFeedback.flatMap(f => f.answers.filter(a => a.section === 'accomplishment').map(a => a.rating));
      facilityAvg = facilityRatings.length > 0 ? facilityRatings.reduce((a, b) => a + b, 0) / facilityRatings.length : 0;
      accomplishmentAvg = accomplishmentRatings.length > 0 ? accomplishmentRatings.reduce((a, b) => a + b, 0) / accomplishmentRatings.length : 0;
    }

    return {
      department: dept,
      total: deptStudents.length,
      submitted: deptSubmitted,
      pending: deptStudents.length - deptSubmitted,
      facilityAvg: Math.round(facilityAvg * 100) / 100,
      accomplishmentAvg: Math.round(accomplishmentAvg * 100) / 100,
    };
  });

  return { total, submitted, pending, deptStats, departments };
}
