// AnalyticsController.js
import students from "./AnalyticsModel.js";

export const getMetrics = () => {
  const totalSubmitted = students.filter(s => s.submitted).length;
  const activeStudents = students.filter(s => s.timeSpent > 0).length;
  const averageTime = Math.round(
    students.filter(s => s.submitted).reduce((sum, s) => sum + s.timeSpent, 0) /
    (students.filter(s => s.submitted).length || 1)
  );
  const averageAccuracy = Math.round(
    students.filter(s => s.submitted && s.score !== null)
      .reduce((sum, s) => sum + s.score, 0) /
    (students.filter(s => s.submitted && s.score !== null).length || 1)
  );

  const topPerformers = students
    .filter(s => s.submitted && s.score >= 80)
    .sort((a, b) => b.score - a.score);

  const failingStudents = students
    .filter(s => s.submitted && s.score < 40);

  const inactiveStudents = students.filter(s => !s.submitted);

  return {
    students,
    totalSubmitted,
    activeStudents,
    averageTime,
    averageAccuracy,
    topPerformers,
    failingStudents,
    inactiveStudents
  };
};

// Simulate a random student submitting every 3s
export const simulateSubmission = () => {
  const pending = students.filter(s => !s.submitted);
  if (pending.length === 0) return;

  const student = pending[Math.floor(Math.random() * pending.length)];
  student.submitted = true;
  student.timeSpent = Math.floor(Math.random() * 10) + 15; // 15-24 min
  student.score = Math.floor(Math.random() * 61) + 40; // 40-100%
};
