// ...existing code...
import mongoose from "mongoose";

/**
 * Aggregated metrics snapshot schema
 * - defaults added to avoid undefined values on responses
 * - index on timestamp for efficient queries
 */
const AggregateSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    events1Sec: { type: Number, default: 0 },
    events5Sec: { type: Number, default: 0 },
    events60Sec: { type: Number, default: 0 },
    uniques1: { type: Number, default: 0 },
    uniques5: { type: Number, default: 0 },
    uniques60: { type: Number, default: 0 },
    topRoutes1: {
      type: [
        {
          route: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    topRoutes5: {
      type: [
        {
          route: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    topRoutes60: {
      type: [
        {
          route: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// index for efficient time-based queries
AggregateSchema.index({ timestamp: -1 });

const Aggregate = mongoose.model("Aggregate", AggregateSchema);
export default Aggregate;
// ...existing code...