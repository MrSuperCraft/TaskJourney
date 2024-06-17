'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaLightbulb, FaChartLine, FaStar, FaGamepad } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { Card, CardBody } from '@nextui-org/react';

const features = [
    {
        icon: <FaCheckCircle className="w-8 h-8 text-teal dark:text-teal" />,
        title: 'Task Management',
        description: 'Easily create, manage, and track your tasks to stay on top of your goals.'
    },
    {
        icon: <FaLightbulb className="w-8 h-8 text-amber-400 dark:text-amber-300" />,
        title: 'Insightful Analytics',
        description: 'Gain insights into your productivity with detailed analytics and reports.'
    },
    {
        icon: <FaChartLine className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
        title: 'Progress Tracking',
        description: 'Track your progress and achieve your milestones with ease.'
    },
    {
        icon: <TbMessageChatbot className="w-8 h-8 text-green-500 dark:text-green-400" />,
        title: 'AI - Driven Planning',
        description: 'Utilize our AI assistance in order to better understand your plans.'
    },
    {
        icon: <FaGamepad className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
        title: 'Gamification Elements',
        description: 'Enjoy gamified features that make task management fun and engaging.'
    },
    {
        icon: <FaStar className="w-8 h-8 text-yellow-400 dark:text-yellow-300" />,
        title: 'Reward System',
        description: 'Earn rewards and achievements for completing tasks and meeting goals.'
    },
];

const Features: React.FC = () => {
    return (
        <section className="py-16 bg-gray-100 dark:bg-slate-900 transition-all duration-500">
            <div className="container mx-auto px-4">
                <h2 className="font-inter text-3xl md:text-4xl font-bold text-center mb-12 text-black dark:text-white">
                    Our Features & Qualities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 transition-all duration-500">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="p-4"
                        >
                            <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transition-all duration-500">
                                <CardBody className="transition-all duration-500">
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-inter md:text-xl font-semibold text-black dark:text-white mb-2 text-md">
                                        {feature.title}
                                    </h3>
                                    <p className="font-lato text-gray-600 dark:text-gray-300">
                                        {feature.description}
                                    </p>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
