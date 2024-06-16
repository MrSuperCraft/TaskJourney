// hooks/useUserData.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the import path according to your setup
import Task from '../dashboard/task-manager/types';

interface UserData {
    uid: string;
    username: string;
    email: string;
    photoURL: string;
    description: string;
    tasks: Task[]; // Assuming Task is a type representing your task structure
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
                        const tasks = await fetchUserTasks(userId); // Fetch tasks from the subcollection

                        setUserData({
                            uid: user.uid,
                            username: data?.username || 'Guest',
                            email: user.email || '',
                            photoURL: data?.photoURL || '',
                            description: data?.description || '',
                            tasks: tasks, // Assign fetched tasks here
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

    // Function to fetch tasks from the tasks subcollection
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

    return { loading, authenticated, user, userData };
};

export default useUserData;
