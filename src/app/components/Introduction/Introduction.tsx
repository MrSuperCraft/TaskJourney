import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

const Introduction: React.FC = () => {
    return (
        <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-all duration-500">
            <div className="container mx-auto px-4">
                <h2 className="font-inter text-3xl md:text-4xl font-bold text-center text-black dark:text-white mb-12">
                    Introduction to TaskJourney
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <motion.div
                            className="rounded-lg overflow-hidden shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '100%', height: 'auto' }}
                        >
                            <Image
                                src="/completed-task-31.svg"
                                alt="TaskJourney Mockup"
                                className="object-cover object-center w-full h-auto"
                                width={500}
                                height={500}
                            />
                        </motion.div>
                    </div>
                    <div>
                        <Card className="bg-white dark:bg-gray-800">
                            <CardBody>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato">
                                    <span className='font-bold'>TaskJourney</span> enhances productivity and gamifies life.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato mt-4">
                                    Easily manage tasks, track progress, set goals, and gain productivity insights.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato mt-4">
                                    Our AI assistant can help you out with getting started and achieving your goals.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-lato mt-4">
                                    Turn tasks into exciting challenges with TaskJourney.
                                </p>
                                <div className="mt-8 flex justify-center">
                                    <Link href="/about">
                                        <Button variant="shadow" color="primary">
                                            Learn More About TaskJourney
                                        </Button>
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Introduction;
