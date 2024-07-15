import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, db } from '../firebase';
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

export const fetchUserData = async (user: FirebaseUser): Promise<UserData> => {
    console.log('Fetching user data from Firestore');
    const userId = user.uid;
    const userRef = doc(db, 'users', userId);

    const docSnapshot = await getDoc(userRef);
    if (!docSnapshot.exists()) {
        throw new Error('User document does not exist.');
    }

    const data = docSnapshot.data();
    const tasks = await fetchUserTasks(userId);
    const events = await fetchUserEvents(userId);
    const statistics = await fetchUserStatistics(userId);

    return {
        uid: user.uid,
        username: data?.username || 'Guest',
        email: user.email || '',
        photoURL: data?.photoURL || '',
        description: data?.description || '',
        tasks,
        events,
        achievements: [],
        statistics,
    };
};

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

const fetchAchievements = async (userId: string): Promise<Achievement[]> => {
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
    const statisticsSnapshot = await getDoc(statisticsRef);

    if (!statisticsSnapshot.exists()) {
        console.log('Statistics document does not exist for user:', userId);
        return initialStatistics;
    }

    const statisticsData = statisticsSnapshot.data() as Statistics;
    return statisticsData;
};


const useUserData = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setAuthenticated(true);
                setUser(authUser);
                queryClient.invalidateQueries({ queryKey: ['userData', authUser.uid] }); // Invalidate user data query on auth state change
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router, queryClient]);

    const memoizedUser = useMemo(() => user, [user]);

    const { data: userData, isLoading } = useQuery({
        queryKey: ['userData', memoizedUser?.uid],
        queryFn: () => fetchUserData(memoizedUser!),

        enabled: !!memoizedUser,
        staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
        gcTime: 1000 * 60 * 60 * 24, // Garbage collection for 24 hours
        refetchOnWindowFocus: false, // Disable refetch on window focus
        refetchOnReconnect: false, // Disable refetch on reconnect
        refetchOnMount: false, // Disable refetch on mount
        initialData: {
            uid: '',
            username: '',
            email: '',
            photoURL: '',
            description: '',
            tasks: [],
            events: [],
            achievements: [],
            statistics: initialStatistics,
        },

    }
    );

    return { isLoading, authenticated, user, userData };
};

export default useUserData;
