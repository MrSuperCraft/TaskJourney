import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import achievementsData from "../dashboard/achievements/data";
import { db } from "@/app/firebase";
import {
    doc,
    updateDoc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import useUserData from "../hooks/useUserData";
import AchievementToast from "../dashboard/achievements/AchievementToast";
import { useAuth } from "./AuthContext";
import { Badge, Achievement, Statistics } from '@/app/dashboard/types';

interface AchievementContextProps {
    achievements: Achievement[];
    badges: Badge[];
    statistics: Statistics;
    updateAchievement: (updatedAchievement: Achievement) => void;
    updateBadge: (updatedBadge: Badge) => void;
    trackProgress: (actionType: string, params?: any) => void;
}

const initialAchievements: Achievement[] = achievementsData;

const initialBadges: Badge[] = [
    {
        id: 1,
        name: "Beginner",
        description: "Complete your first task",
        icon: "/icons/beginner.png",
        earned: false,
    },
    // Add more badges as needed
];

export const initialStatistics: Statistics = {
    id: "stats",
    tasksCreated: 0,
    tasksCompleted: 0,
    streaks: 0,
    calendarEvents: 0,
    dailyQuestsCompleted: 0,
    achievementsUnlocked: 0,
    badgesEarned: 0,
    tasksCompletedToday: 0,
    tasksCreatedToday: 0,
    exp: 0,
    level: 1,
    friendsConnected: 0,
    completedAchivements: 0,
    eventsAttended: 0,
};

const AchievementContext = createContext<AchievementContextProps>({
    achievements: initialAchievements,
    badges: initialBadges,
    statistics: initialStatistics,
    updateAchievement: () => { },
    updateBadge: () => { },
    trackProgress: () => { },
});

export const useAchievements = () => useContext(AchievementContext);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
    const [badges, setBadges] = useState<Badge[]>(initialBadges);
    const [statistics, setStatistics] = useState<Statistics>(initialStatistics);
    const { userData } = useUserData();
    const uid = useAuth().user?.uid;
    const queryClient = useQueryClient();

    const fetchUserStatisticsAndAchievements = async () => {
        if (!uid) return { statistics: initialStatistics, achievements: initialAchievements };

        const userDocRef = doc(db, `users/${uid}/statistics/stats`);
        const achievementsDocRef = doc(db, `users/${uid}/achievements/achievementsDoc`);

        const [docSnapshot, achievementsSnapshot] = await Promise.all([
            getDoc(userDocRef),
            getDoc(achievementsDocRef),
        ]);

        const stats = docSnapshot.exists()
            ? (docSnapshot.data() as Statistics)
            : initialStatistics;

        if (!docSnapshot.exists()) {
            await setDoc(userDocRef, initialStatistics);
        }

        const userAchievements = achievementsSnapshot.exists()
            ? (achievementsSnapshot.data().achievements as Achievement[])
            : initialAchievements;

        if (!achievementsSnapshot.exists()) {
            await setDoc(achievementsDocRef, { achievements: initialAchievements });
        }

        return { statistics: stats, achievements: userAchievements };
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['userStatisticsAndAchievements', uid],
        queryFn: fetchUserStatisticsAndAchievements,
        enabled: !!uid,
    });

    useEffect(() => {
        if (data) {
            setAchievements(data.achievements);
            setStatistics(data.statistics);
        }
    }, [data]);

    const updateAchievement = async (updatedAchievement: Achievement) => {
        setAchievements((prev: Achievement[]) =>
            prev.map((ach) => (ach.id === updatedAchievement.id ? updatedAchievement : ach))
        );

        const imgSrc = "/favicon-32x32.png"; // Replace with the path to your image

        const handleClose = () => {
            toast.dismiss();
        };

        const existingAchievement = achievements.find((ach) => ach.id === updatedAchievement.id);

        if (updatedAchievement.completed) {
            if (!existingAchievement?.dateCompleted) {
                toast(
                    <AchievementToast
                        message={`Achievement Unlocked: ${updatedAchievement.name}`}
                        imgSrc={imgSrc}
                        onClose={handleClose}
                    />,
                    { autoClose: false }
                );
            }
        } else if (updatedAchievement.progress > 0 && updatedAchievement.progress < 100) {
            toast(
                <AchievementToast
                    message={`Progress Update: ${updatedAchievement.name} - ${updatedAchievement.progress}%`}
                    imgSrc={imgSrc}
                    onClose={handleClose}
                />,
                { autoClose: false }
            );
        }

        const achievementsDocRef = doc(db, `users/${uid}/achievements/achievementsDoc`);
        await updateDoc(achievementsDocRef, {
            achievements: achievements.map((ach) => ach.id === updatedAchievement.id ? updatedAchievement : ach),
        });
    };

    const updateBadge = (updatedBadge: Badge) => {
        setBadges((prev: Badge[]) =>
            prev.map((badge) => (badge.id === updatedBadge.id ? updatedBadge : badge))
        );
        if (updatedBadge.earned) {
            toast.success(`Badge Earned: ${updatedBadge.name}`);
        }
    };

    const trackProgress = async (actionType: string, params?: any) => {
        if (!userData) return;

        let updatedStats: Partial<Statistics> = {};

        switch (actionType) {
            case "taskCreation":
                updatedStats.tasksCreated = (statistics.tasksCreated || 0) + 1;
                if (params) {
                    const { date } = params;
                    if (!statistics.streaks) {
                        updatedStats.streaks = 1;
                        updatedStats.tasksCreatedToday = (statistics.tasksCreatedToday || 0) + 1;
                    } else if (date.getDate() !== new Date(statistics.streaks).getDate()) {
                        updatedStats.streaks = 1;
                        updatedStats.tasksCreatedToday = 1;
                    } else {
                        updatedStats.streaks = (statistics.streaks || 0) + 1;
                        updatedStats.tasksCreatedToday = (statistics.tasksCreatedToday || 0) + 1;
                    }
                    if (updatedStats.tasksCreatedToday > 20) {
                        updatedStats.tasksCreatedToday = 20;
                    }
                }
                break;
            case "taskCompletion":
                updatedStats.tasksCompleted = (statistics.tasksCompleted || 0) + 1;
                break;
            case "calendarEvent":
                updatedStats.calendarEvents = (statistics.calendarEvents || 0) + 1;
                break;
            case "dailyQuestCompletion":
                updatedStats.dailyQuestsCompleted = (statistics.dailyQuestsCompleted || 0) + 1;
                if (params) {
                    const { date } = params;
                    if (!statistics.streaks) {
                        updatedStats.streaks = 1;
                    } else if (date.getDate() !== new Date(statistics.streaks).getDate()) {
                        updatedStats.streaks = 1;
                    } else {
                        updatedStats.streaks = (statistics.streaks || 0) + 1;
                    }

                    if (Math.abs(date.getDate() - new Date(statistics.streaks).getDate()) >= 2) {
                        updatedStats.streaks = 0;
                    }
                }
                break;
            case "achievementUnlocked":
                updatedStats.achievementsUnlocked = (statistics.achievementsUnlocked || 0) + 1;
                break;
            case "badgeEarned":
                updatedStats.badgesEarned = (statistics.badgesEarned || 0) + 1;
                break;
            case "levelUp":
                if (params) {
                    const { level } = params;
                    updatedStats.level = level;
                }
                break;
            default:
                break;
        }

        setStatistics((prevStats: Statistics) => ({
            ...prevStats,
            ...updatedStats,
        }));

        const docRef = doc(db, `users/${userData.uid}/statistics/stats`);
        await updateDoc(docRef, updatedStats);
    };

    return (
        <AchievementContext.Provider
            value={{
                achievements,
                badges,
                statistics,
                updateAchievement,
                updateBadge,
                trackProgress,
            }}
        >
            {children}
        </AchievementContext.Provider>
    );
};
