// pages/dashboard.tsx
'use client';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/sidebar/Sidebar';
import { ThemeProviderWithAttribute } from '../contexts/ThemeContext';
import { AuthContextProvider } from '../contexts/AuthContext';
import { auth, db } from '../firebase'; // Adjust the import path according to your setup
import { onAuthStateChanged, User } from 'firebase/auth';
import Loading from '../Loading';
import WelcomeMessage from './components/WelcomeMessageOnDash';
import { doc, getDoc } from 'firebase/firestore';
import { ProfileProvider } from '../contexts/ProfileContext';
import LevelTracker from './components/Widgets/LevelTracker/LevelTracker';
import Streak from './components/Widgets/Streak/Streak';
import { AchievementProvider, useAchievements } from '../contexts/AchievementsContext';
import useUserData from '../hooks/useUserData';


const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);

    const [userName, setUserName] = useState<string>('Guest');
    const router = useRouter();

    const { userData } = useUserData();
    const { trackProgress } = useAchievements();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setAuthenticated(true);
                setUser(authUser);
            } else {
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    // Inside your component or function
    useEffect(() => {
        if (user) {
            const userId = user.uid;
            const userRef = doc(db, 'users', userId);

            getDoc(userRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        if (userData && userData.username) {
                            setUserName(userData.username);
                            setPhotoURL(userData.photoURL);

                        }
                    } else {
                        console.log('User document does not exist.');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [user]);

    if (loading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }



    return (
        <AchievementProvider>
            <ProfileProvider>
                <AuthContextProvider>
                    <ThemeProviderWithAttribute>
                        <div className="h-screen flex">
                            <Sidebar />
                            <div className="flex-1 overflow-y-auto max-h-screen px-4 py-8">
                                <WelcomeMessage name={userName} />
                                {/* Temporarily disabled due to excessive read / write actions
                                <LevelTracker
                                    currentExp={userData?.statistics?.exp || 0}
                                    level={userData?.statistics.level || 0}
                                />
                                */}
                                <Streak days={userData?.statistics.streaks || 0} />
                            </div>
                        </div>
                    </ThemeProviderWithAttribute>
                </AuthContextProvider>
            </ProfileProvider>
        </AchievementProvider>
    );
};

export default DashboardPage;
