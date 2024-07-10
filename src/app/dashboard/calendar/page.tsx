import React from 'react';
import CalendarPage from '@/app/dashboard/calendar/CalendarPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Calendar',
    description: 'Add events, view, edit and delete - all with the click of a button. Manage your events with ease, with the help of TaskJourney.',
};


export default function Page() {
    return (
        <CalendarPage />
    )
}