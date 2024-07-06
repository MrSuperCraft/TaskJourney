'use client';


import React from 'react';
import { Divider } from '@nextui-org/react';
import PomodoroTimer from './PomodoroTimer';
import Sidebar from '../components/sidebar/Sidebar';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { AchievementProvider } from '@/app/contexts/AchievementsContext';

const PomodoroPage: React.FC = () => {
    return (
        <div className='flex h-screen'>
            <AchievementProvider>
                <ProfileProvider>
                    <ThemeProviderWithAttribute>
                        <Sidebar />
                        <div className="p-4 flex-grow pl-20">
                            <h1 className="text-3xl mb-4 font-bold">Pomodoro Timer</h1>
                            <Divider />
                            <PomodoroTimer />
                            <div className="mt-6">
                                <h2 className="text-2xl font-bold">About the Pomodoro Technique</h2>
                                <p className="mt-4">
                                    The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
                                    The technique uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
                                    These intervals are known as &quot;pomodoros&quot;. The technique is designed to improve productivity by providing structure and encouraging focused work sessions.
                                </p>
                                <h3 className="text-xl mt-4 font-bold">How It Works</h3>
                                <ul className="mt-2 list-disc list-inside">
                                    <li>Work for 25 minutes, then take a 5-minute break.</li>
                                    <li>After 4 pomodoros, take a longer break (15-30 minutes).</li>
                                    <li>Repeat the process to maintain productivity.</li>
                                </ul>
                            </div>
                        </div>
                    </ThemeProviderWithAttribute>
                </ProfileProvider>
            </AchievementProvider>
        </div>
    );
};

export default PomodoroPage;
