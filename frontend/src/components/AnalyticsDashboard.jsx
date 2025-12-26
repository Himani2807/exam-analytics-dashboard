import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./AnalyticsDashboard.css";

const socket = io("http://localhost:5000");

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
    // WebSocket live updates
    socket.on("metrics", (data) => setMetrics(data));
    return () => socket.off("metrics");
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Exam Dashboard</h2>

      <div className="metrics-grid">
        <div className="metric-card total-submissions">
          <h3>Total Submissions</h3>
          <div className="metric-value">{metrics.totalSubmitted}/{metrics.students.length}</div>
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
        <button className={tab === "submissions" ? "active" : ""} onClick={() => setTab("submissions")}>Submissions</button>
        <button className={tab === "active" ? "active" : ""} onClick={() => setTab("active")}>Active Students</button>
      </div>

      {tab === "submissions" && (
        <div className="list-section">
          <h3>All Students</h3>
          <div className="students-list">
            {metrics.students.map(s => (
              <div key={s.id} className={`student-item ${s.submitted ? "submitted" : "pending"}`}>
                <span className="name">{s.name}</span>
                <span className="time">Time: {s.timeSpent} min</span>
                <span className="score">Score: {s.score !== null ? s.score : "-" }%</span>
                <span className="status">{s.submitted ? "Submitted" : "In Progress"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "active" && (
        <div className="list-section">
          <h3>Active Students</h3>
          <div className="students-list">
            {metrics.students.filter(s => !s.submitted && s.timeSpent > 0).map(s => (
              <div key={s.id} className="student-item active">
                <span className="name">{s.name}</span>
                <span className="time">Time: {s.timeSpent} min</span>
                <span className="status">In Progress</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="performance-section">
        <div className="top-performers">
          <h3>Top Performers (80%+)</h3>
          <div className="performers-list">
            {metrics.topPerformers.map(s => (
              <div key={s.id} className="performer-item top">
                <span className="name">{s.name}</span>
                <span className="score">{s.score}%</span>
                <span className="time">{s.timeSpent} min</span>
              </div>
            ))}
          </div>
        </div>
        <div className="failing-students">
          <h3>Failing Students (&lt;40%)</h3>
          <div className="performers-list">
            {metrics.failingStudents.map(s => (
              <div key={s.id} className="performer-item failing">
                <span className="name">{s.name}</span>
                <span className="score">{s.score}%</span>
                <span className="time">{s.timeSpent} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
