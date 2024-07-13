'use client';

import { Divider, Avatar, Spacer, Tabs, Tab } from '@nextui-org/react';
import { collectionGroup, query, orderBy, limit, getDocs, doc, getDoc, setDoc, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { FaStar, FaTrophy, FaUser } from 'react-icons/fa';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import Sidebar from '../components/sidebar/Sidebar';
import { db } from '@/app/firebase';
import Loading from '@/app/Loading';
import Link from 'next/link';

const Leaderboard = () => {
    const { data: topUsers = [], isLoading, isError } = useQuery<User[]>({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            console.log('Fetching leaderboard...');
            try {
                const leaderboardStatsDocRef = doc(db, 'LeaderBoardStats', 'leaderboard');
                const leaderboardStatsDoc = await getDoc(leaderboardStatsDocRef);

                const now = new Date();
                const lastUpdate = leaderboardStatsDoc.data()?.lastUpdate?.toDate();
                const eetMidnight = new Date();
                eetMidnight.setUTCHours(22, 0, 0, 0); // Midnight in EET is 22:00 UTC

                if (!lastUpdate || now > eetMidnight || now.getDate() !== lastUpdate.getDate()) {
                    console.log('LeaderBoardStats document needs update, fetching user statistics...');
                    const leaderboardRef = collectionGroup(db, 'statistics');

                    // Fetching top users based on a single criteria (tasksCompleted in this case)
                    const statsQuery = query(leaderboardRef, orderBy('tasksCompleted', 'desc'), limit(100));
                    const statsSnapshot = await getDocs(statsQuery);
                    const topUsers = await getUserData(statsSnapshot);

                    console.log(`Received ${topUsers.length} users with statistics data.`);

                    // Save the fetched data in LeaderBoardStats document for future use
                    await setDoc(leaderboardStatsDocRef, { topUsers, lastUpdate: now });

                    return topUsers as User[];
                } else {
                    console.log('Fetched data from LeaderBoardStats document.');
                    return leaderboardStatsDoc.data()?.topUsers as User[] || [];
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                throw error;
            }
        },
        refetchOnWindowFocus: false,
    });

    if (isLoading) return <Loading />;
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">There was an error fetching leaderboard...</p>
                <Link href="/dashboard" className="text-blue-500 ">Return to Dashboard</Link>
            </div>
        );
    }

    // Separate users by metrics without mutating the original array
    const topUsersByTasksCompleted = [...topUsers].sort((a, b) => b.stats.tasksCompleted - a.stats.tasksCompleted);
    const topUsersByStreaks = [...topUsers].sort((a, b) => b.stats.streaks - a.stats.streaks);
    const topUsersByLevels = [...topUsers].sort((a, b) => b.stats.level - a.stats.level);

    const renderUserCard = (user: User, index: number, metric: string) => (
        <div className="mb-4 flex flex-col items-center" key={user.uid}>
            <Divider className="my-4" />
            <div className="leaderboard-card flex flex-row items-center py-2 w-full">
                <span className="text-lg lg:text-xl font-bold">{index + 1}</span>
                <Spacer x={3} />
                <Avatar src={user.photoURL} icon={<FaUser className='w-8 h-8' />} className="leaderboard-avatar w-10 h-10 lg:w-16 lg:h-16" />
                <Spacer x={1} />
                <div className="leaderboard-details flex-1 text-left">
                    <h4 className="font-bold text-md lg:text-lg">{user.username}</h4>
                </div>
                <Spacer x={1} />
                <div className="text-center lg:text-right">
                    <p className="font-semibold text-sm lg:text-xl">
                        {user.stats[metric as keyof Statistics]}
                    </p>
                </div>
            </div>
            <Divider className="my-4" />
        </div>
    );

    const isSmall = typeof window !== 'undefined' ? window.innerWidth < 768 : true;

    return (
        <div>
            <ProfileProvider>
                <ThemeProviderWithAttribute>
                    <div className="h-screen flex">
                        <Sidebar />
                        <div className="container px-4 py-8 sm:ml-10 md:ml-16 lg:ml-20 overflow-y-auto w-full">
                            <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100 mb-4 flex mx-auto"><FaTrophy className='dark:text-yellow-400 text-yellow-500 mr-2' /> Leaderboard - Top Users <FaStar className='ml-2 dark:text-yellow-400 text-yellow-500' />  </h1>
                            <Divider className="my-4" />
                            <Tabs variant='underlined' size={isSmall ? 'sm' : 'lg'} className='mx-auto overflow-x-auto'>
                                <Tab title="Tasks Completed ✅">
                                    <div className="leaderboard-list">
                                        {topUsersByTasksCompleted.map((user, index) =>
                                            renderUserCard(user, index, 'tasksCompleted')
                                        )}
                                    </div>
                                </Tab>
                                <Tab title="Streaks 🔥">
                                    <div className="leaderboard-list">
                                        {topUsersByStreaks.map((user, index) => renderUserCard(user, index, 'streaks'))}
                                    </div>
                                </Tab>
                                <Tab title="Levels ⚡">
                                    <div className="leaderboard-list">
                                        {topUsersByLevels.map((user, index) => renderUserCard(user, index, 'level'))}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </ThemeProviderWithAttribute>
            </ProfileProvider>
        </div>
    );
};

export default Leaderboard;

// Function to fetch user data and format it
async function getUserData(snapshot: QuerySnapshot<DocumentData>): Promise<User[]> {
    const usersData = await Promise.all(snapshot.docs.map(async doc => {
        const userData = doc.data();
        const userDoc = await getDoc(doc.ref.parent.parent!);
        const user = userDoc.data();

        if (!user) return null;

        return {
            uid: doc.ref?.parent?.parent?.id || 'stats',
            username: user?.username || 'Unidentified User',
            photoURL: user?.photoURL || '',
            stats: {
                tasksCompleted: userData.tasksCompleted,
                streaks: userData.streaks,
                level: userData.level || 0, // Assuming level is a field in user stats
            }
        };
    }));

    return usersData.filter(user => user !== null) as User[];
}

// Define the User type for type safety
type User = {
    uid: string;
    photoURL: string;
    username: string;
    stats: Statistics;
};

// Define the Statistics type for type safety
type Statistics = {
    tasksCompleted: number;
    streaks: number;
    level: number;
};
