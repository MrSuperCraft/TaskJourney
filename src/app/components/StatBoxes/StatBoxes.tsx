// src/components/StatBoxes.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from './FormatNumber';

const stats = [
    { title: 'Total Users', value: 10234 },
    { title: 'Active Users', value: 1234 },
    { title: 'Tasks Created', value: 75892 },
    { title: 'Tasks Completed', value: 58924 },
    { title: 'Goals Set', value: 20345 },
    { title: 'Goals Achieved', value: 18345 },
    { title: 'Active Projects', value: 892 },
    { title: 'Rewards Earned', value: 9234 },
    { title: 'AI Assistance Requests', value: 1245 },
];

const StatBoxes: React.FC = () => {
    const [displayedStats, setDisplayedStats] = useState(stats.map(stat => ({ ...stat, displayedValue: 0 })));

    useEffect(() => {
        let animationFrameId: number;

        const updateStats = () => {
            setDisplayedStats(currentStats =>
                currentStats.map(stat => ({
                    ...stat,
                    displayedValue: stat.displayedValue < stat.value
                        ? Math.min(stat.value, stat.displayedValue + Math.ceil(stat.value / 100))
                        : stat.value,
                }))
            );

            // Continue the animation if there are still values to update
            if (displayedStats.some(stat => stat.displayedValue < stat.value)) {
                animationFrameId = requestAnimationFrame(updateStats);
            }
        };

        animationFrameId = requestAnimationFrame(updateStats);

        return () => cancelAnimationFrame(animationFrameId);
    }, [displayedStats]);

    return (
        <section className="py-16 bg-white dark:bg-gray-800 transition-all duration-500">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black dark:text-white">Our Community in Numbers</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayedStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 + 1, ease: 'easeInOut' }}
                            className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg"
                        >
                            <h3 className="text-2xl font-bold dark:text-sky-blue text-teal">
                                {formatNumber(stat.displayedValue)}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.title}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatBoxes;
