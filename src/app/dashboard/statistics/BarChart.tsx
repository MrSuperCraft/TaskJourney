// BarChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

const BarChart = ({ data }: { data: number[] }) => {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], // Example labels
        datasets: [
            {
                label: 'Tasks Created Over Time',
                data: data, // Use the data passed from props
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                },
            },
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;
