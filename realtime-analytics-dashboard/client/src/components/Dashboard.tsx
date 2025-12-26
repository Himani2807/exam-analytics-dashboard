import React from 'react';
import Chart from './Chart';
import { useSocket } from '../hooks/useSocket';

const Dashboard: React.FC = () => {
    const { data } = useSocket();

    return (
        <div className="dashboard">
            <h1>Real-Time Analytics Dashboard</h1>
            <div className="charts">
                {data && data.map((chartData, index) => (
                    <Chart key={index} data={chartData} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;