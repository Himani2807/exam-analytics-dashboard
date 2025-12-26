import React from 'react';
import { Line } from 'react-chartjs-2';

interface ChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    };
}

const Chart: React.FC<ChartProps> = ({ data }) => {
    return (
        <div>
            <Line data={data} />
        </div>
    );
};

export default Chart;