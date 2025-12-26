import { Request, Response } from 'express';
import { getMetrics } from '../services/metricsService';

class MetricsController {
    async fetchMetrics(req: Request, res: Response): Promise<void> {
        try {
            const metrics = await getMetrics();
            res.status(200).json(metrics);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching metrics', error });
        }
    }
}

export default new MetricsController();