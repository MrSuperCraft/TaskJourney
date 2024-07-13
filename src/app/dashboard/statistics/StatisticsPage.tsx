'use client';


import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { Divider, Card, CardBody } from '@nextui-org/react';
import Loading from '@/app/Loading';
import useUserData from '@/app/hooks/useUserData';
import { motion } from 'framer-motion';
import { FaTasks, FaMedal, FaStar, FaCalendarAlt, FaUserFriends, FaBolt, FaLevelUpAlt, FaList, FaFire, FaScroll, FaInfoCircle } from 'react-icons/fa';
import BarChart from './BarChart';


const StatisticsPage = () => {
    const { isLoading, authenticated, user, userData } = useUserData();
    const statistics = userData.statistics;

    // Generate chart data randomly
    const totalTasksCreatedOverTime = [10, 20, 15, 25, 30, 20, 15, 25, 30];

    if (isLoading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null; // Handle non-authenticated state
    }

    return (
        <ProfileProvider>
            <ThemeProviderWithAttribute>
                <div className="h-screen flex">
                    <Sidebar />
                    <div className="container px-4 py-8 sm:ml-10 md:ml-16 lg:ml-20 overflow-y-auto w-full">
                        <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100 mb-4">Statistics</h1>
                        <Divider className="my-4" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Tasks Created */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaTasks className="text-4xl text-green-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tasks Created</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.tasksCreated}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Total number of tasks created on the Task Manager</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Tasks Completed */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaScroll className="text-4xl text-blue-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tasks Completed</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.tasksCompleted}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Total number of tasks completed on the Task Manager</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Streaks */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaFire className="text-4xl text-yellow-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Streaks</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.streaks}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Current streak of completing tasks every day</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Daily Quests Completed */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaList className="text-4xl text-purple-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daily Quests Completed</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.dailyQuestsCompleted}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Total number of daily quests completed</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Badges Earned */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaMedal className="text-4xl text-yellow-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Badges Earned</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.badgesEarned}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Total number of badges earned</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Experience Points (EXP) */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaBolt className="text-4xl text-blue-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience Points (EXP)</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.exp}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Experience points accumulated in the current level</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Level */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaLevelUpAlt className="text-4xl text-green-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Level</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.level}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Current level based on experience points</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>


                            {/* Events Attended */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="text-4xl text-red-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Events Attended</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.eventsAttended || 0}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Total number of events attended</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>

                            {/* Friends Connected */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div className="flex items-center">
                                            <FaUserFriends className="text-4xl text-blue-500 mr-4" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Friends Connected</h3>
                                                <p className="text-2xl text-gray-800 dark:text-gray-200">{statistics.friendsConnected || 0}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-2 text-gray-500 dark:text-gray-300">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-xs">Total number of friends connected</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>



                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Card className="p-4 cursor-pointer hover:shadow-xl transition duration-300">
                                    <CardBody>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tasks Created Over Time</h3>
                                            <div className="mt-4">
                                                <BarChart data={totalTasksCreatedOverTime} />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </ThemeProviderWithAttribute>
        </ProfileProvider>
    );
};

export default StatisticsPage;
