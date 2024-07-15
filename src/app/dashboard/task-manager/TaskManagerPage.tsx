'use client'


import React from 'react';
import { Divider } from '@nextui-org/react';
import Sidebar from '../components/sidebar/Sidebar';
import useUserData from '../../hooks/useUserData';
import { useRouter } from 'next/navigation';
import Loading from '../../Loading';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import TaskManager from './components/TaskManager';
import { Providers } from '@/app/Providers';
import { EditorProvider } from '@/app/contexts/EditorContext';
import { AchievementProvider } from '@/app/contexts/AchievementsContext';


const TaskManagerPage: React.FC = () => {
    const { isLoading, authenticated, user, userData } = useUserData();
    const router = useRouter();

    if (isLoading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }

    return (
        <AchievementProvider>
            <ProfileProvider>
                <EditorProvider>
                    <Providers>
                        <ThemeProviderWithAttribute>
                            <div className="h-screen flex">
                                <Sidebar />
                                <div className="container  py-8 sm:ml-10 md:ml-16 lg:ml-20 overflow-auto">
                                    <h1 className="text-3xl font-bold mb-8 px-4">Task Manager</h1>
                                    <Divider />
                                    <TaskManager />
                                </div>
                            </div>
                        </ThemeProviderWithAttribute>
                    </Providers>
                </EditorProvider>
            </ProfileProvider>
        </AchievementProvider>
    );
};

export default TaskManagerPage;
