'use client';

import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import React from 'react'
import Sidebar from '../components/sidebar/Sidebar';
import Calendar from './Calendar';
import { useRouter } from 'next/navigation';
import useUserData from '@/app/hooks/useUserData';
import Loading from '@/app/Loading';

const CalendarPage = () => {

    const { loading, authenticated, user, userData } = useUserData();
    const router = useRouter();

    if (loading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }


    return (
        <>
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
        </>
    )
}

export default CalendarPage;