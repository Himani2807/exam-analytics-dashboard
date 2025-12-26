import { Metric } from '../types'; // Importing the Metric type from types

// Simulated database for metrics
const metricsDatabase: Metric[] = [];

// Function to add a new metric
export const addMetric = (metric: Metric): void => {
    metricsDatabase.push(metric);
};

// Function to retrieve all metrics
export const getMetrics = (): Metric[] => {
    return metricsDatabase;
};

// Function to retrieve a metric by ID
export const getMetricById = (id: string): Metric | undefined => {
    return metricsDatabase.find(metric => metric.id === id);
};

// Function to clear all metrics (for testing purposes)
export const clearMetrics = (): void => {
    metricsDatabase.length = 0;
};