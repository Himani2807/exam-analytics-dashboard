import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchMetrics = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/metrics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error;
    }
};

export const postMetric = async (metricData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/metrics`, metricData);
        return response.data;
    } catch (error) {
        console.error('Error posting metric:', error);
        throw error;
    }
};