import express from "express";
import aggregator from "../services/aggregator.js";
import Analytics from "../models/AnalyticsModel.js";

const router = express.Router();

// Get all analytics data
router.get("/", async (req, res) => {
  try {
    // Get real-time metrics from aggregator
    const realtimeStats = aggregator.stats();
    
    // Get recent exam submissions
    const submissions = await Analytics.find({ eventName: "exam_submitted" })
      .sort({ timestamp: -1 })
      .limit(10);

    // Calculate student statistics
    const totalSubmissions = submissions.length;
    const activeStudents = await Analytics.distinct('metadata.studentId').length;

    // Calculate averages
    const averageTime = submissions.length > 0
      ? submissions.reduce((sum, ev) => sum + (ev.metadata.timeSpentMinutes || 0), 0) / submissions.length
      : 0;

    const averageScore = submissions.length > 0
      ? submissions.reduce((sum, ev) => sum + (ev.metadata.score || 0), 0) / submissions.length
      : 0;

    // Combine all data
    const response = {
      realtime: realtimeStats,
      stats: {
        submissions: submissions.map(ev => ({
          studentId: ev.metadata.studentId,
          name: ev.metadata.name,
          timeSpentMinutes: ev.metadata.timeSpentMinutes || 0,
          score: ev.metadata.score || 0,
          submittedAt: ev.timestamp
        })),
        totalSubmissions,
        activeStudents,
        averageTime: Math.round(averageTime),
        averageScore: Math.round(averageScore)
      }
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get events history
router.get("/events", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, data: events });
  } catch (error) {
    console.error("Events fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Record new event
router.post("/events", async (req, res) => {
  try {
    const { eventName, metadata } = req.body;

    if (!eventName) {
      return res.status(400).json({ 
        success: false, 
        error: "Event name is required" 
      });
    }

    // Validate metadata
    if (!metadata || !metadata.studentId || !metadata.name) {
      return res.status(400).json({
        success: false,
        error: "Required metadata missing (studentId, name)"
      });
    }

    // Create and save event
    const newEvent = await Analytics.create({
      eventName,
      metadata,
      timestamp: Date.now()
    });

    // Update real-time metrics
    aggregator.pushEvent({
      timestamp: newEvent.timestamp,
      eventName: newEvent.eventName,
      metadata: newEvent.metadata
    });

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;