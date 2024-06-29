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

const AchievementPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const { achievements, badges } = useAchievements();

    const filteredAchievements = selectedCategory === 'All' ? achievements : achievements.filter(ach => ach.category === selectedCategory);

    return (
        <>
            <div className='flex h-screen'>
                <ProfileProvider>
                    <ThemeProviderWithAttribute>
                        <ToastContainer />
                        <Sidebar />
                        <div className="p-4">
                            <h1 className="text-3xl mb-4 font-bold">Achievements</h1>
                            <Divider />
                            <div className="flex items-center mb-4">
                                <span className="text-xl">Level 10</span>
                                <Progress value={70} className="ml-4 w-full" />
                            </div>
                            <Tabs onSelectionChange={(key) => setSelectedCategory(key as string)}>
                                <Tab key="All" title="All">
                                    <AchievementList achievements={filteredAchievements} />
                                </Tab>
                                <Tab key="Productivity" title="Productivity">
                                    <AchievementList achievements={filteredAchievements} />
                                </Tab>
                                <Tab key="Consistency" title="Consistency">
                                    <AchievementList achievements={filteredAchievements} />
                                </Tab>
                                <Tab key="Skill Mastery" title="Skill Mastery">
                                    <AchievementList achievements={filteredAchievements} />
                                </Tab>
                                <Tab key="Special Events" title="Special Events">
                                    <AchievementList achievements={filteredAchievements} />
                                </Tab>
                            </Tabs>
                            <h2 className="text-2xl mt-6 mb-4">Badges</h2>
                            <BadgeGallery badges={badges} />
                            <ToastContainer />
                        </div>
                    </ThemeProviderWithAttribute>
                </ProfileProvider>
            </div>
        </>
    );
};

const AchievementList: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => (
    <div className="grid grid-cols-2 gap-4">
        {achievements.map(achievement => (
            <Card key={achievement.id} className="p-4">
                <h3 className="text-xl">{achievement.name}</h3>
                <p>{achievement.description}</p>
                <Progress value={achievement.progress} className="my-2" />
                {achievement.completed && <p>Completed on: {achievement.dateCompleted?.toLocaleDateString()}</p>}
            </Card>
        ))}
    </div>
);

const BadgeGallery: React.FC<{ badges: Badge[] }> = ({ badges }) => (
    <div className="grid grid-cols-4 gap-4">
        {badges.map(badge => (
            <Tooltip key={badge.id} content={badge.earned ? badge.description : 'Locked'}>
                <Card className="p-4 text-center">
                    <img src={badge.icon} alt={badge.name} className="w-16 h-16 mx-auto" />
                    <p>{badge.name}</p>
                </Card>
            </Tooltip>
        ))}
    </div>
);

export default AchievementPage;
