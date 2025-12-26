import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    avgTime: 0,
    avgScore: 0,
    topPerformers: [],
    failing: [],
    notStarted: [],
    activeStudents: 0,
  });

  useEffect(() => {
    socket.on("updateStudents", data => {
      setStudents(data.students); // full list
      setStats(data.stats); // stats
    });

    return () => socket.off("updateStudents");
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#1e88e5" }}>Nimbus Analytics</h1>
      <h2 style={{ color: "#ff7043" }}>Exam Dashboard - Class 616</h2>

      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
        <div style={{ background: "#e3f2fd", padding: "15px", borderRadius: "8px", width: "150px" }}>
          <h3>Total Submissions</h3>
          <p>{stats.totalSubmissions}/20</p>
        </div>
        <div style={{ background: "#f3e5f5", padding: "15px", borderRadius: "8px", width: "150px" }}>
          <h3>Avg Time</h3>
          <p>{stats.avgTime} min</p>
        </div>
        <div style={{ background: "#fff9c4", padding: "15px", borderRadius: "8px", width: "150px" }}>
          <h3>Avg Accuracy</h3>
          <p>{stats.avgScore}%</p>
        </div>
        <div style={{ background: "#c8e6c9", padding: "15px", borderRadius: "8px", width: "150px" }}>
          <h3>Active Students</h3>
          <p>{stats.activeStudents}</p>
        </div>
      </div>

      <h2 style={{ color: "#1e88e5" }}>All Students</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {students.map(s => (
          <div
            key={s.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "180px",
              margin: "10px",
              padding: "10px",
              background: s.submitted
                ? s.score >= 80
                  ? "#c8e6c9"
                  : s.score < 40
                  ? "#ffcdd2"
                  : "#e0f7fa"
                : "#eeeeee",
            }}
          >
            <h4>{s.name}</h4>
            <p>Time: {s.submitted ? s.time + " min" : "—"}</p>
            <p>Score: {s.submitted ? s.score + "%" : "Not Started"}</p>
            <p>{s.submitted ? "Submitted" : "Not Started"}</p>
          </div>
        ))}
      </div>

      <h2 style={{ color: "#ff7043" }}>Top Performers (≥80%)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {stats.topPerformers.map(s => (
          <div
            key={s.id}
            style={{
              border: "1px solid #4caf50",
              borderRadius: "8px",
              width: "150px",
              margin: "5px",
              padding: "10px",
              background: "#a5d6a7",
            }}
          >
            <h4>{s.name}</h4>
            <p>{s.score}%</p>
          </div>
        ))}
      </div>

      <h2 style={{ color: "#d32f2f" }}>Failing Students (&lt;40%)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {stats.failing.map(s => (
          <div
            key={s.id}
            style={{
              border: "1px solid #f44336",
              borderRadius: "8px",
              width: "150px",
              margin: "5px",
              padding: "10px",
              background: "#ef9a9a",
            }}
          >
            <h4>{s.name}</h4>
            <p>{s.score}%</p>
          </div>
        ))}
      </div>

      <h2 style={{ color: "#757575" }}>Not Started</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {stats.notStarted.map(s => (
          <div
            key={s.id}
            style={{
              border: "1px solid #9e9e9e",
              borderRadius: "8px",
              width: "150px",
              margin: "5px",
              padding: "10px",
              background: "#eeeeee",
            }}
          >
            <h4>{s.name}</h4>
            <p>Not Started</p>
          </div>
        ))}
      </div>
    </div>
  );
}
