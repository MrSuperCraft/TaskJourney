'use client'


import React, { useState } from 'react';
import { Divider, Button } from '@nextui-org/react';
import Sidebar from '../components/sidebar/Sidebar';
import useUserData from '../../hooks/useUserData';
import { useRouter } from 'next/navigation';
import Loading from '../../Loading';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import TaskManager from './components/TaskManager';
import { Providers } from '@/app/Providers';
import { EditorProvider } from '@/app/contexts/EditorContext';

const TaskManagerPage: React.FC = () => {
    const { loading, authenticated, user, userData } = useUserData();
    const router = useRouter();

    if (loading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }

    return (
        <ProfileProvider>
            <EditorProvider>
                <Providers>
                    <ThemeProviderWithAttribute>
                        <div className="h-screen flex">
                            <Sidebar />
                            <div className="container px-4 py-8 ml-20 overflow-auto">
                                <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
                                <Divider />
                                <TaskManager />
                            </div>
                        </div>
                    </ThemeProviderWithAttribute>
                </Providers>
            </EditorProvider>
        </ProfileProvider>
    );
};

export default TaskManagerPage;
