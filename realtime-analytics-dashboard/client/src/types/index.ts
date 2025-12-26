export interface Metric {
    id: string;
    name: string;
    value: number;
    timestamp: Date;
}

export interface DashboardData {
    metrics: Metric[];
    updatedAt: Date;
}

export interface ChartData {
    labels: string[];
    values: number[];
}