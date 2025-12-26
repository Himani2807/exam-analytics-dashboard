// server.js (ES Module)
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 20 students
let students = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  time: 0,
  score: 0,
  submitted: false,
}));

function computeStats(students) {
  const submitted = students.filter(s => s.submitted);
  const totalSubmissions = submitted.length;
  const avgTime = totalSubmissions
    ? Math.round(submitted.reduce((acc, s) => acc + s.time, 0) / totalSubmissions)
    : 0;
  const avgScore = totalSubmissions
    ? Math.round(submitted.reduce((acc, s) => acc + s.score, 0) / totalSubmissions)
    : 0;
  const topPerformers = submitted.filter(s => s.score >= 80);
  const failing = submitted.filter(s => s.score < 40);
  const notStarted = students.filter(s => !s.submitted);
  const activeStudents = submitted.length;

  return { totalSubmissions, avgTime, avgScore, topPerformers, failing, notStarted, activeStudents };
}

// Simulate submissions gradually
setInterval(() => {
  const pending = students.filter(s => !s.submitted);
  if (pending.length > 0) {
    const idx = Math.floor(Math.random() * pending.length);
    const student = pending[idx];
    student.submitted = true;
    student.time = Math.floor(Math.random() * 5) + 15; // 15-19 min
    student.score = Math.floor(Math.random() * 101); // 0-100%
  }

  io.emit("updateStudents", { students, stats: computeStats(students) });
}, 5000);

io.on("connection", socket => {
  console.log("Client connected:", socket.id);
  socket.emit("updateStudents", { students, stats: computeStats(students) });
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

server.listen(5000, () => console.log("Server running on port 5000"));
