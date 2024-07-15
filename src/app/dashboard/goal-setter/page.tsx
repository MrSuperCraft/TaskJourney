import React from 'react';
import { Metadata } from 'next';
import GoalSetterPage from './GoalSetterPage';

export const metadata: Metadata = {
    title: 'Goal Setter',
    description: 'Set your goals and achieve them. Track your progress and achieve your goals.',
}


const page = () => {
    return (
        <GoalSetterPage />
    )
}

export default page;