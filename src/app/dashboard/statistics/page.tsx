import React from 'react'
import StatisticsPage from './StatisticsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Statistics',
    description: 'View your statistics, track your progress, and make sure you stay on top of your goals.'
}


const page = () => {
    return (
        <div>
            <StatisticsPage />
        </div>
    )
}

export default page
