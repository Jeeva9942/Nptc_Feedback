import { useRef } from 'react';
import { FeedbackSubmission, DEPARTMENT_NAMES, Department, RATING_LABELS } from '@/types';
import { facilityQuestions, participationQuestions, accomplishmentQuestions } from '@/data/questions';

interface Props {
  department: Department;
  feedback: FeedbackSubmission[];
}

export default function PrintReport({ department, feedback }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const totalStudents = feedback.length;

  const getQuestionStats = (section: 'facilities' | 'accomplishment', questionId: number) => {
    const ratings = feedback.map(f => {
      const ans = f.answers.find(a => a.section === section && a.questionId === questionId);
      return ans?.rating || 0;
    });
    const counts = [0, 0, 0, 0]; // 1,2,3,4
    ratings.forEach(r => { if (r >= 1 && r <= 4) counts[r - 1]++; });
    const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return { counts, avg: Math.round(avg * 100) / 100 };
  };

  const getParticipationStats = (questionId: number) => {
    const answers = feedback.map(f => {
      const ans = f.answers.find(a => a.section === 'participation' && a.questionId === questionId);
      return ans?.rating || 0;
    });
    const yes = answers.filter(a => a === 1).length;
    const no = answers.filter(a => a === 0).length;
    return { yes, no };
  };

  return (
    <div ref={ref} className="print-report p-8 bg-card">
      {/* College Header */}
      <div className="text-center mb-6 print-avoid-break">
        <h1 className="text-xl font-display font-bold text-foreground">
          Government Nachimuthu Polytechnic College
        </h1>
        <p className="text-sm text-muted-foreground">
          Aided Autonomous Institute · Approved by AICTE, New Delhi
        </p>
        <p className="text-sm text-muted-foreground">
          Affiliated to State Board of Technical Education & Training, Tamil Nadu
        </p>
        <p className="text-xs text-muted-foreground">
          Estd: 1957 · Accredited by APACC with Gold Level
        </p>
        <h2 className="text-lg font-display font-bold text-foreground mt-4">EXIT SURVEY</h2>
        <p className="text-sm text-foreground">
          Department: {DEPARTMENT_NAMES[department]} · Term: VI · Total Responses: {totalStudents}
        </p>
      </div>

      {/* Section A: Facilities */}
      <div className="mb-6 print-avoid-break">
        <h3 className="text-sm font-bold text-foreground mb-2">A. General Assessment - Comment</h3>
        <table className="w-full border-collapse border text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Criteria</th>
              <th className="border p-2 text-center">Very Good (4)</th>
              <th className="border p-2 text-center">Good (3)</th>
              <th className="border p-2 text-center">Average (2)</th>
              <th className="border p-2 text-center">Below Avg (1)</th>
              <th className="border p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {facilityQuestions.map(q => {
              const { counts } = getQuestionStats('facilities', q.id);
              return (
                <tr key={q.id}>
                  <td className="border p-2">{q.id}. {q.text}</td>
                  <td className="border p-2 text-center">{counts[3]}</td>
                  <td className="border p-2 text-center">{counts[2]}</td>
                  <td className="border p-2 text-center">{counts[1]}</td>
                  <td className="border p-2 text-center">{counts[0]}</td>
                  <td className="border p-2 text-center">{totalStudents}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section B: Participation */}
      <div className="mb-6 print-avoid-break">
        <h3 className="text-sm font-bold text-foreground mb-2">B. Students Participation</h3>
        <table className="w-full border-collapse border text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">S.No</th>
              <th className="border p-2 text-left">Question</th>
              <th className="border p-2 text-center">Yes</th>
              <th className="border p-2 text-center">No</th>
              <th className="border p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {participationQuestions.map(q => {
              const { yes, no } = getParticipationStats(q.id);
              return (
                <tr key={q.id}>
                  <td className="border p-2 text-center">{q.id}</td>
                  <td className="border p-2">{q.text}</td>
                  <td className="border p-2 text-center">{yes}</td>
                  <td className="border p-2 text-center">{no}</td>
                  <td className="border p-2 text-center">{totalStudents}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section C: Accomplishment */}
      <div className="mb-6 print-avoid-break">
        <h3 className="text-sm font-bold text-foreground mb-2">C. Assessment of Accomplishment</h3>
        <table className="w-full border-collapse border text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">S.No</th>
              <th className="border p-2 text-left">Criteria</th>
              <th className="border p-2 text-center">Very Good (4)</th>
              <th className="border p-2 text-center">Good (3)</th>
              <th className="border p-2 text-center">Average (2)</th>
              <th className="border p-2 text-center">Below Avg (1)</th>
              <th className="border p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {accomplishmentQuestions.map(q => {
              const { counts } = getQuestionStats('accomplishment', q.id);
              return (
                <tr key={q.id}>
                  <td className="border p-2 text-center">{q.id}</td>
                  <td className="border p-2 text-sm">{q.text}</td>
                  <td className="border p-2 text-center">{counts[3]}</td>
                  <td className="border p-2 text-center">{counts[2]}</td>
                  <td className="border p-2 text-center">{counts[1]}</td>
                  <td className="border p-2 text-center">{counts[0]}</td>
                  <td className="border p-2 text-center">{totalStudents}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Strengths & Improvements */}
      <div className="mb-6 print-avoid-break">
        <h3 className="text-sm font-bold text-foreground mb-2">Strengths and Areas for Improvement</h3>
        <table className="w-full border-collapse border text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Strengths</th>
              <th className="border p-2 text-left">Areas that need improvement</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <tr key={i}>
                <td className="border p-2">{f.strengths || '-'}</td>
                <td className="border p-2">{f.improvements || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 print-avoid-break">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Date: {new Date().toLocaleDateString()}</span>
          <span>Exit Survey Report - {DEPARTMENT_NAMES[department]}</span>
        </div>
        <div className="flex justify-between mt-12 text-xs">
          <div className="text-center">
            <div className="border-t border-foreground w-40 mb-1" />
            <p className="text-foreground">HOD Signature</p>
          </div>
          <div className="text-center">
            <div className="border-t border-foreground w-40 mb-1" />
            <p className="text-foreground">Principal Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
