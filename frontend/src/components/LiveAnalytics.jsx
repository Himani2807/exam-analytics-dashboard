import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./AnalyticsDashboard.css";

const socket = io("http://localhost:5000", { 
  transports: ["websocket"],
  withCredentials: true
});

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    students: [],
    totalSubmitted: 0,
    activeStudents: 0,
    averageTime: 0,
    averageAccuracy: 0,
    topPerformers: [],
    failingStudents: []
  });

  const [tab, setTab] = useState("submissions");

  useEffect(() => {
    const handleMetrics = (data) => {
      console.log("Received metrics:", data); // Debug log
      setMetrics(data);
    };

    socket.on("metrics", handleMetrics);
    
    // Request initial data
    socket.emit("requestMetrics");

    return () => {
      socket.off("metrics", handleMetrics);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Exam Dashboard</h2>

      <div className="metrics-grid">
        <div className="metric-card total-submissions">
          <h3>Total Submissions</h3>
          <div className="metric-value">{metrics.totalSubmitted}/20</div>
        </div>

        <div className="metric-card average-time">
          <h3>Avg Time</h3>
          <div className="metric-value">{metrics.averageTime} min</div>
        </div>

        <div className="metric-card average-accuracy">
          <h3>Avg Accuracy</h3>
          <div className="metric-value">{metrics.averageAccuracy}%</div>
        </div>

        <div className="metric-card active-students">
          <h3>Active Students</h3>
          <div className="metric-value">{metrics.activeStudents}</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={tab === "submissions" ? "active" : ""} 
          onClick={() => setTab("submissions")}
        >
          Submissions
        </button>
        <button 
          className={tab === "active" ? "active" : ""} 
          onClick={() => setTab("active")}
        >
          Active Students
        </button>
      </div>

      {tab === "submissions" && (
        <div className="list-section">
          <h3>All Students</h3>
          <div className="students-list">
            {metrics.students.map(student => (
              <div key={student.id} className={`student-item ${student.submitted ? "submitted" : "pending"}`}>
                <span className="name">{student.name}</span>
                <span className="time">Time: {student.timeSpent} min</span>
                <span className="score">Score: {student.score || 0}%</span>
                <span className="status">{student.submitted ? "Submitted" : "In Progress"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "active" && (
        <div className="list-section">
          <h3>Active Students</h3>
          <div className="students-list">
            {metrics.students.filter(s => s.timeSpent > 0).map(student => (
              <div key={student.id} className="student-item active">
                <span className="name">{student.name}</span>
                <span className="time">Time: {student.timeSpent} min</span>
                <span className="status">{student.submitted ? "Submitted" : "In Progress"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="performance-section">
        <div className="top-performers">
          <h3>Top Performers (80%+)</h3>
          <div className="performers-list">
            {metrics.topPerformers?.map(student => (
              <div key={student.id} className="performer-item top">
                <span className="name">{student.name}</span>
                <span className="score">{student.score}%</span>
                <span className="time">{student.timeSpent} min</span>
              </div>
            ))}
          </div>
        </div>

        <div className="failing-students">
          <h3>Failing Students (&lt;40%)</h3>
          <div className="performers-list">
            {metrics.failingStudents?.map(student => (
              <div key={student.id} className="performer-item failing">
                <span className="name">{student.name}</span>
                <span className="score">{student.score}%</span>
                <span className="time">{student.timeSpent} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}