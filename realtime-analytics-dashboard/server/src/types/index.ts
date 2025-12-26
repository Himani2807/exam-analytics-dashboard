export interface Metric {
    id: string;
    name: string;
    value: number;
    timestamp: Date;
}

export interface MetricsResponse {
    metrics: Metric[];
}

export interface WebSocketMessage {
    type: string;
    payload: any;
}