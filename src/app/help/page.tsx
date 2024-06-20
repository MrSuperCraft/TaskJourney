'use client';

import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';
import Footer from '../components/Footer/Footer';
import { motion } from 'framer-motion';
import { Input } from '@nextui-org/react';
import { FiSettings, FiUser, FiGrid, FiHelpCircle, FiArrowRight, FiSearch } from 'react-icons/fi';

const HelpCenter = () => {
    return (
        <>
            <Navbar />
            <div className="relative w-full h-[50vh] flex flex-col justify-center items-center">
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <Image
                        src="/hero.svg"
                        alt="Grainy Gradient SVG"
                        layout="fill"
                        objectFit="cover"
                        style={{ mixBlendMode: 'soft-light', opacity: '0.8' }}
                    />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="container mx-auto text-center relative z-10 text-black flex flex-col justify-center max-md:mt-5 items-center lg:flex-row lg:items-center lg:justify-center lg:space-x-8"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        <Image src="/Chat bubble.png" alt='Chat bubble Hero Image' width={700} height={700} priority />
                    </motion.div>
                </motion.div>
            </div>

            <div className="bg-gray-200 py-10">
                <div className="container mx-auto">
                    <div className="flex justify-center mb-10">
                        <Input
                            isClearable
                            placeholder="Search..."
                            startContent={<FiSearch />}
                            className=" border border-gray-300 rounded-xl shadow-sm w-full max-w-xl"
                            size="lg"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:border-blue-500 transition-border duration-300 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                                <FiSettings className="text-red-500 w-6 h-6 mr-3" />
                                <h3 className="text-xl font-bold font-inter">Account Settings</h3>
                            </div>
                            <p className="text-gray-700 font-lato">Manage your account settings and set e-mail preferences.</p>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 flex items-center">
                                Learn More <FiArrowRight className="ml-2" />
                            </button>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:border-blue-500 transition-border duration-300 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                                <FiUser className="text-green-500 w-6 h-6 mr-3" />
                                <h3 className="text-xl font-bold font-inter">Profile</h3>
                            </div>
                            <p className="text-gray-700 font-lato">Edit your personal information and change your password.</p>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 flex items-center">
                                Learn More <FiArrowRight className="ml-2" />
                            </button>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:border-blue-500 transition-border duration-300 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                                <FiGrid className="text-blue-500 w-6 h-6 mr-3" />
                                <h3 className="text-xl font-bold font-inter">Dashboard</h3>
                            </div>
                            <p className="text-gray-700 font-lato">Overview of your activities and access to various tools.</p>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 flex items-center">
                                Learn More <FiArrowRight className="ml-2" />
                            </button>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:border-blue-500 transition-border duration-300 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                                <FiHelpCircle className="text-purple-500 w-6 h-6 mr-3" />
                                <h3 className="text-xl font-bold font-inter">Help & Support</h3>
                            </div>
                            <p className="text-gray-700 font-lato">Get assistance and find answers to your questions.</p>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 flex items-center">
                                Learn More <FiArrowRight className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default HelpCenter;
