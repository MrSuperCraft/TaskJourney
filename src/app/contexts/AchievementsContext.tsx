import { Achievement, Badge, Statistics } from "@/app/dashboard/types";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import achievementsData from "../dashboard/achievements/data";
import { db } from "@/app/firebase";
import { doc, updateDoc, getDoc, setDoc, collection, getDocs, query } from "firebase/firestore";
import useUserData from "../hooks/useUserData";
import AchievementToast from '../dashboard/achievements/AchievementToast';

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
    { id: 1, name: "Beginner", description: "Complete your first task", icon: "/icons/beginner.png", earned: false },
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
    level: 1
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

    useEffect(() => {
        if (userData) {
            const fetchUserStatisticsAndAchievements = async () => {
                const userDocRef = doc(db, `users/${userData.uid}/statistics/stats`);
                const achievementsCollectionRef = collection(db, `users/${userData.uid}/achievements`);

                try {
                    const docSnapshot = await getDoc(userDocRef);

                    if (docSnapshot.exists()) {
                        setStatistics(docSnapshot.data() as Statistics);
                    } else {
                        await setDoc(userDocRef, initialStatistics);
                        setStatistics(initialStatistics); // Set local state after creation
                    }

                    const achievementsSnapshot = await getDocs(query(achievementsCollectionRef));
                    if (achievementsSnapshot.empty) {
                        // If the achievements collection is empty, initialize it with initial achievements
                        initialAchievements.forEach(async (achievement) => {
                            const achievementDocRef = doc(achievementsCollectionRef, achievement.id.toString());
                            await setDoc(achievementDocRef, achievement);
                        });
                        setAchievements(initialAchievements);
                    } else {
                        const userAchievements: Achievement[] = [];
                        achievementsSnapshot.forEach(doc => {
                            userAchievements.push(doc.data() as Achievement);
                        });
                        setAchievements(userAchievements);
                    }
                } catch (error) {
                    console.error("Error fetching user statistics or achievements:", error);
                    // Handle error fetching document
                }
            };

            fetchUserStatisticsAndAchievements();
        }
    }, [userData]);

    const updateAchievement = async (updatedAchievement: Achievement) => {
        setAchievements((prev) =>
            prev.map((ach) => (ach.id === updatedAchievement.id ? updatedAchievement : ach))
        );

        const imgSrc = '/favicon-32x32.png'; // Replace with the path to your image

        const handleClose = () => {
            toast.dismiss();
        };

        const existingAchievement = achievements.find((ach) => ach.id === updatedAchievement.id);

        if (updatedAchievement.completed) {
            // Check if the achievement was just completed or already completed but has no dateCompleted
            if (!existingAchievement?.dateCompleted) {
                toast(
                    <AchievementToast
                        message={`Achievement Unlocked: ${updatedAchievement.name}`}
                        imgSrc={imgSrc}
                        onClose={handleClose}
                    />,
                    { autoClose: false }
                );
                /* trackProgress("achievementUnlocked");  -- Temporarily stopped due to heavy use */
            }
        } else if (updatedAchievement.progress > 0 && updatedAchievement.progress < 100) {
            // Show progress update toast when there's progress done, between 0 and 100%
            toast(
                <AchievementToast
                    message={`Progress Update: ${updatedAchievement.name} - ${updatedAchievement.progress}%`}
                    imgSrc={imgSrc}
                    onClose={handleClose}
                />,
                { autoClose: false }
            );
        }

        /* Temporarily stopped due to heavy use of the system
        if (userData) {
            const achievementDocRef = doc(db, `users/${userData.uid}/achievements/${updatedAchievement.id}`);
            await setDoc(achievementDocRef, updatedAchievement);
        }
            */
    };



    const updateBadge = (updatedBadge: Badge) => {
        setBadges((prev) => prev.map((badge) => (badge.id === updatedBadge.id ? updatedBadge : badge)));
        if (updatedBadge.earned) {
            toast.success(`Badge Earned: ${updatedBadge.name}`);
            /* trackProgress("badgeEarned"); */
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

        setStatistics((prevStats) => ({
            ...prevStats,
            ...updatedStats,
        }));

        const docRef = doc(db, `users/${userData.uid}/statistics/stats`);
        await updateDoc(docRef, updatedStats);

        // Check for achievement completion based on the updated statistics
        achievements.forEach((achievement) => {
            const { requirements } = achievement;
            let isCompleted = true;
            let progressPercentage = 0;

            for (const key in requirements) {
                if (requirements.hasOwnProperty(key)) {
                    const value = requirements[key as keyof typeof requirements];
                    const statValue = statistics[key as keyof Statistics];

                    if (typeof value === "number" && typeof statValue === "number") {
                        if (statValue < value) {
                            isCompleted = false;
                            const fixedValue = value.toFixed(2);
                            const fixedStatValue = statValue.toFixed(2);
                            progressPercentage = Math.min(((parseFloat(fixedStatValue) / parseFloat(fixedValue)) * 100), 100);
                            progressPercentage = 100;
                        }
                    } else {
                        isCompleted = false;
                        break;
                    }
                }
            }

            if (isCompleted && !achievement.completed) {
                const updatedAchievement = {
                    ...achievement,
                    progress: 100,
                    completed: true,
                    dateCompleted: new Date().toDateString(),
                };

                updateAchievement(updatedAchievement);
            } else {
                const updatedAchievement = {
                    ...achievement,
                    progress: progressPercentage,
                };

                updateAchievement(updatedAchievement);
            }
        });
    };



    return (
        <AchievementContext.Provider value={{ achievements, badges, statistics, updateAchievement, updateBadge, trackProgress }}>
            {children}
        </AchievementContext.Provider>
    );
};
