'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '@nextui-org/react';

const Introduction: React.FC = () => {
    return (
        <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-all duration-500">
            <div className="container mx-auto px-4">
                <h2 className="font-inter text-3xl md:text-4xl font-bold text-center text-black dark:text-white mb-12">
                    Introduction to TaskJourney
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <motion.img
                            src="/mockup window.png" // Replace with the path to your demo/mockup image
                            alt="TaskJourney Mockup"
                            className="w-full rounded-lg shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div>
                        <Card className="bg-white dark:bg-gray-800">
                            <CardBody>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato">
                                    TaskJourney is a powerful platform designed to gamify your life and enhance productivity.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato mt-4">
                                    With TaskJourney, you can easily manage your tasks, track your progress, set goals, and get insights into your productivity habits.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato mt-4">
                                    Our AI-driven planning feature helps you make smarter decisions and stay focused on what matters most.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato mt-4">
                                    Discover a new way to approach your goals and turn your everyday tasks into exciting challenges!
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Introduction;
