import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Achievement, Badge } from '@/app/dashboard/types';

interface AchievementContextProps {
    achievements: Achievement[];
    badges: Badge[];
    updateAchievement: (updatedAchievement: Achievement) => void;
    updateBadge: (updatedBadge: Badge) => void;
}

const initialAchievements: Achievement[] = [
    { id: '1', category: 'Productivity', name: 'Task Master', description: 'Complete 100 tasks', progress: 100, completed: true, dateCompleted: new Date() },
    // More achievements
];

const initialBadges: Badge[] = [
    { id: '1', name: 'Beginner', description: 'Complete your first task', icon: '/icons/beginner.png', earned: true, dateEarned: new Date() },
    // More badges
];

const AchievementContext = createContext<AchievementContextProps>({
    achievements: initialAchievements,
    badges: initialBadges,
    updateAchievement: () => { },
    updateBadge: () => { },
});

export const useAchievements = () => useContext(AchievementContext);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
    const [badges, setBadges] = useState<Badge[]>(initialBadges);

    const updateAchievement = (updatedAchievement: Achievement) => {
        setAchievements(prev => prev.map(ach => ach.id === updatedAchievement.id ? updatedAchievement : ach));
        if (updatedAchievement.completed) {
            toast.success(`Achievement Unlocked: ${updatedAchievement.name}`);
        } else if (updatedAchievement.progress > 0) {
            toast.info(`Progress Update: ${updatedAchievement.name} - ${updatedAchievement.progress}%`);
        }
    };

    const updateBadge = (updatedBadge: Badge) => {
        setBadges(prev => prev.map(badge => badge.id === updatedBadge.id ? updatedBadge : badge));
        if (updatedBadge.earned) {
            toast.success(`Badge Earned: ${updatedBadge.name}`);
        }
    };

    return (
        <AchievementContext.Provider value={{ achievements, badges, updateAchievement, updateBadge }}>
            {children}
        </AchievementContext.Provider>
    );
};
