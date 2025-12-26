class Aggregator {
  constructor() {
    this.metrics = {
      events1Sec: 0,
      events5Sec: 0,
      events60Sec: 0,
      uniques1: new Set(),
      uniques5: new Set(),
      uniques60: new Set(),
      events: []
    };
  }

  pushEvent(event) {
    this.metrics.events.push(event);
    this.metrics.events1Sec++;
    this.metrics.events5Sec++;
    this.metrics.events60Sec++;

    if (event.metadata?.studentId) {
      this.metrics.uniques1.add(event.metadata.studentId);
      this.metrics.uniques5.add(event.metadata.studentId);
      this.metrics.uniques60.add(event.metadata.studentId);
    }
  }

  stats() {
    return {
      timestamp: new Date().toISOString(),
      events1Sec: this.metrics.events1Sec,
      events5Sec: this.metrics.events5Sec,
      events60Sec: this.metrics.events60Sec,
      uniques1: this.metrics.uniques1.size,
      uniques5: this.metrics.uniques5.size,
      uniques60: this.metrics.uniques60.size
    };
  }
}

export default new Aggregator();