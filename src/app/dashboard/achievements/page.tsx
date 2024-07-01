'use client';

import { useState } from 'react';
import { Card, Progress, Tabs, Tab, Tooltip, Divider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAchievements } from '@/app/contexts/AchievementsContext';
import Sidebar from '../components/sidebar/Sidebar';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { Achievement, Badge } from '../types';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';

import achievementsData from './data';




const badgesData: Badge[] = [
    {
        id: 1,
        name: 'Task Starter',
        description: 'Start your journey by creating your first task!',
        icon: '/badges/Badge 1 - Task Starter.png',
        earned: true, // Assuming it's earned by default
    },
    {
        id: 2,
        name: 'Productivity Pro',
        description: 'Consistently complete tasks to boost your productivity.',
        icon: '/badges/Badge 2 - Productivity Pro.png',
        earned: false,
    },
    {
        id: 3,
        name: 'Master Of Time',
        description: 'Effectively manage your time and achieve more.',
        icon: '/badges/Badge 3 - Master Of Time.png',
        earned: false,
    },
    {
        id: 4,
        name: 'Efficiency Expert',
        description: 'Optimize your workflow for maximum efficiency.',
        icon: '/badges/Badge 4 - Efficiency Expert.png',
        earned: false,
    },
    // Add more badges as needed
];

const AchievementPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    // Assuming badgesData is fetched or initialized from useAchievements
    const { badges } = useAchievements();

    // Extract unique categories from achievementsData
    const categories = Array.from(new Set(achievementsData.map(ach => ach.category)));

    // Filter achievements based on selected category
    const filteredAchievements = selectedCategory === 'All'
        ? achievementsData
        : achievementsData.filter(ach => ach.category === selectedCategory);

    return (
        <div className='flex h-screen'>
            <ProfileProvider>
                <ThemeProviderWithAttribute>
                    <ToastContainer />
                    <Sidebar />
                    <div className="p-4 flex-grow pl-20 overflow-auto">
                        <h1 className="text-3xl mb-4 font-bold">Achievements</h1>
                        <Divider />
                        <div className="flex items-center mb-4">
                            <span className="text-xl">Level 10</span>
                            <Progress value={70} className="ml-4 flex-grow" />
                        </div>
                        <Tabs onSelectionChange={(key) => setSelectedCategory(key as string)}>
                            <Tab key="All" title="All">
                                <AchievementList achievements={filteredAchievements} />
                            </Tab>
                            {categories.map(category => (
                                <Tab key={category} title={category}>
                                    <AchievementList achievements={filteredAchievements.filter(ach => ach.category === category)} />
                                </Tab>
                            ))}
                        </Tabs>
                        <h2 className="text-2xl mt-6 mb-4">Badges</h2>
                        <BadgeGallery badges={badgesData} />
                        <ToastContainer />
                    </div>
                </ThemeProviderWithAttribute>
            </ProfileProvider>
        </div>
    );
};


const AchievementList: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => (
    <div className="grid grid-cols-2 gap-4">
        {achievements.map(achievement => (
            <Card key={achievement.id} className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className={`text-xl font-bold ${achievement.completed ? 'dark:text-primary-brand-600 text-primary-brand-800' : ''}`}>{achievement.name}</h3>
                    {achievement.completed && (
                        <FaCheckCircle className="dark:text-primary-brand-600 text-primary-brand-800" />
                    )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                <Progress value={achievement.progress} className="my-2"
                    label="Achievement Progress"
                    showValueLabel={true}
                    classNames={{
                        value: 'font-semibold',
                        indicator: `${achievement.completed ? 'bg-primary-brand-600 dark:bg-primary-brand-500' : 'bg-gray-200 dark:bg-gray-800'}`,
                    }}
                />
                {achievement.completed && (
                    <p className="text-xs text-gray-500">Completed on: {achievement.dateCompleted?.toLocaleDateString()}</p>
                )}
            </Card>
        ))}
    </div>
);

const BadgeGallery: React.FC<{ badges: Badge[] }> = ({ badges }) => (
    <div className="grid grid-cols-4 gap-4">
        {badges.map(badge => (
            <Tooltip key={badge.id} content={badge.earned ? badge.description : 'Locked'}>
                <Card className={`p-4 text-center ${badge.earned ? '' : 'bg-gray-200 dark:bg-gray-800'}`}>
                    {badge.earned ? (
                        <>
                            <Image src={badge.icon} width={128} height={128} alt={badge.name} className="w-auto h-auto mx-auto" />
                            <p className="text-md font-semibold mt-2 text-gray-900 dark:text-white">{badge.name}</p>
                        </>
                    ) : (
                        <>
                            <div className={`my-auto ${badge.earned ? 'text-gray-900' : 'dark:text-gray-300'}`}>
                                <FaLock className={`text-gray-500 ${badge.earned ? '' : 'dark:text-gray-500'} w-10 h-10 mx-auto`} />
                                <p className={`text-sm mt-2 ${badge.earned ? '' : 'dark:text-gray-500'} text-gray-500 dark:text-gray-300`}>Locked</p>
                            </div>
                        </>
                    )}
                </Card>
            </Tooltip>
        ))}
    </div>
);

export default AchievementPage;
