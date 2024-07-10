
'use client';


import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import GoalSetter from './GoalSetter';
import { Divider } from '@nextui-org/react';
import Loading from '@/app/Loading';
import { useRouter } from 'next/navigation';
import useUserData from '@/app/hooks/useUserData';


const GoalSetterPage = () => {

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
                    <div className="h-screen flex">
                        <Sidebar />
                        <div className="container px-4 py-8 sm:ml-10 md:ml-16 lg:ml-20 overflow-y-auto w-full ">
                            <h1 className='font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl'>Goal Setter</h1>
                            <Divider className='mb-4 mt-2' />
                            <GoalSetter />
                        </div>
                    </div>
                </ThemeProviderWithAttribute>
            </ProfileProvider>

        </>
    )
}

export default GoalSetterPage;