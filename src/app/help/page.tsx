import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';
import Footer from '../components/Footer/Footer';
import { Input } from '@nextui-org/react';
import { FiSettings, FiUser, FiGrid, FiHelpCircle, FiArrowRight, FiSearch } from 'react-icons/fi';
import { ThemeProviderWithAttribute } from '../contexts/ThemeContext';

const HelpCenter = () => {
    return (
        <>
            <ThemeProviderWithAttribute>
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
                    <div
                        className="container mx-auto text-center relative z-10 text-black dark:text-white flex flex-col justify-center max-md:mt-5 items-center lg:flex-row lg:items-center lg:justify-center lg:space-x-8"
                    >
                        <div>
                            <Image src="/Chat bubble.png" alt='Chat bubble Hero Image' className='w-full h-full' width={700} height={700} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 dark:bg-gray-800 py-10">
                    <div className="container mx-auto">
                        <div className="flex justify-center mb-10">
                            <Input
                                isClearable
                                placeholder="Search..."
                                startContent={<FiSearch className='w-6 h-6' />}
                                className="rounded-xl shadow-sm w-full max-w-2xl text-lg transition-all duration-300 hover:shadow-lg hover:border-blue-500 focus:border focus:border-blue-500 focus:ring-0 focus:shadow-lg"
                                size="lg"
                                classNames={{
                                    base: "h-16",
                                    inputWrapper: "h-16"
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-300 transition-border duration-300 hover:shadow-xl">
                                <div className="flex items-center mb-4">
                                    <FiSettings className="text-red-500 dark:text-red-400 w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold font-inter">Account Settings</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-lato">Manage your account settings and set e-mail preferences.</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-300 flex items-center">
                                    Learn More <FiArrowRight className="ml-2" />
                                </button>
                            </div>

                            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-300 transition-border duration-300 hover:shadow-xl">
                                <div className="flex items-center mb-4">
                                    <FiUser className="text-green-500 dark:text-green-400 w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold font-inter">Profile</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-lato">Edit your personal information and change your password.</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-300 flex items-center">
                                    Learn More <FiArrowRight className="ml-2" />
                                </button>
                            </div>

                            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-300 transition-border duration-300 hover:shadow-xl">
                                <div className="flex items-center mb-4">
                                    <FiGrid className="text-blue-500 dark:text-blue-400 w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold font-inter">Dashboard</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-lato">Overview of your activities and access to various tools.</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-300 flex items-center">
                                    Learn More <FiArrowRight className="ml-2" />
                                </button>
                            </div>

                            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-300 transition-border duration-300 hover:shadow-xl">
                                <div className="flex items-center mb-4">
                                    <FiHelpCircle className="text-purple-500 dark:text-purple-400 w-6 h-6 mr-3" />
                                    <h3 className="text-xl font-bold font-inter">Help & Support</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-lato">Get assistance and find answers to your questions.</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-300 flex items-center">
                                    Learn More <FiArrowRight className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </ThemeProviderWithAttribute>
        </>
    );
};

export default HelpCenter;
