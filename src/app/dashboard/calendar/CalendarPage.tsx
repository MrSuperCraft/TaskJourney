'use client';

import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import React from 'react'
import Sidebar from '../components/sidebar/Sidebar';
import Calendar from './Calendar';
import { useRouter } from 'next/navigation';
import useUserData from '@/app/hooks/useUserData';
import Loading from '@/app/Loading';
import { AchievementProvider } from '@/app/contexts/AchievementsContext';

const CalendarPage = () => {

    const { isLoading, authenticated, user, userData } = useUserData();
    const router = useRouter();

    if (isLoading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }


    return (
        <>
            <AchievementProvider>
                <ProfileProvider>
                    <ThemeProviderWithAttribute>
                        <div className='flex h-screen'>
                            <Sidebar />
                            <div className="flex-1 overflow-y-auto max-h-[98vh] px-4 py-8">
                                <Calendar />
                            </div>
                        </div>
                    </ThemeProviderWithAttribute>
                </ProfileProvider>
            </AchievementProvider>
        </>
    )
}

export default CalendarPage;