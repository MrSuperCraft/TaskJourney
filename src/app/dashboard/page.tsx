import React from 'react';
import DashboardPage from './DashboardPage';
import { Metadata } from 'next';



export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'This is your dashboard. Here you can see your progress, statistics, streaks, tasks and more. Customize your experience and reach new heights with the TaskJourney app.'
};


export default function Page() {
    return (
        <DashboardPage />
    );
}

