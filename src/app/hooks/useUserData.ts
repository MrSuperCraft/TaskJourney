// hooks/useUserData.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the import path according to your setup
import { Task, Event, Statistics, Achievement } from '../dashboard/types';
import { initialStatistics } from '../contexts/AchievementsContext';

interface UserData {
    uid: string;
    username: string;
    email: string;
    photoURL: string;
    description: string;
    tasks: Task[];
    events: Event[];
    achievements: Achievement[];
    statistics: Statistics;
}

const useUserData = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();

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

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userId = user.uid;
                const userRef = doc(db, 'users', userId);

                try {
                    const docSnapshot = await getDoc(userRef);
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        const tasks = await fetchUserTasks(userId);
                        const events = await fetchUserEvents(userId);


                        setUserData({
                            uid: user.uid,
                            username: data?.username || 'Guest',
                            email: user.email || '',
                            photoURL: data?.photoURL || '',
                            description: data?.description || '',
                            tasks: tasks,
                            events: events,
                            achievements: data?.achievements || [],
                            statistics: data?.statistics || [],
                        });
                    } else {
                        console.log('User document does not exist.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        }
    }, [user]);

    const fetchUserTasks = async (userId: string): Promise<Task[]> => {
        const tasksRef = collection(db, `users/${userId}/tasks`);
        const tasksSnapshot = await getDocs(tasksRef);
        const tasks: Task[] = [];

        tasksSnapshot.forEach((doc) => {
            tasks.push({
                id: doc.id,
                ...doc.data(),
            } as Task);
        });

        return tasks;
    };

    const fetchUserEvents = async (userId: string): Promise<Event[]> => {
        const eventsRef = collection(db, `users/${userId}/events`);
        const eventsSnapshot = await getDocs(eventsRef);
        const events: Event[] = [];

        eventsSnapshot.forEach((doc) => {
            events.push({
                id: doc.id,
                start: doc.data().start.toDate(),
                end: doc.data().end.toDate(),
                title: doc.data().title,
                description: doc.data().description,
            } as Event);
        });

        return events;
    };

    const fetchAchivements = async (userId: string): Promise<Achievement[]> => {
        const achievementsRef = collection(db, `users/${userId}/achievements`);
        const achievementsSnapshot = await getDocs(achievementsRef);
        const achievements: Achievement[] = [];

        achievementsSnapshot.forEach((doc) => {
            achievements.push({
                ...doc.data(),
            } as Achievement);
        });

        return achievements;
    };

    const fetchUserStatistics = async (userId: string): Promise<Statistics> => {
        const statisticsRef = doc(db, `users/${userId}/statistics/stats`);

        try {
            const statisticsSnapshot = await getDoc(statisticsRef);

            if (statisticsSnapshot.exists()) {
                const statisticsData = statisticsSnapshot.data() as Statistics;
                console.log('Fetched statistics:', statisticsData);
                return statisticsData;
            } else {
                console.log('Statistics document does not exist for user:', userId);
                return initialStatistics;
            }
        } catch (error) {
            console.error('Error fetching user statistics:', error);
            throw error;
        }
    };

    return { loading, authenticated, user, userData };
};

export default useUserData;
