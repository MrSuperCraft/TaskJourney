import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Image from 'next/image';
import Footer from '../components/Footer/Footer';
import { Input } from '@nextui-org/react';
import { FiSettings, FiUser, FiGrid, FiHelpCircle, FiArrowRight, FiSearch } from 'react-icons/fi';
import { ThemeProviderWithAttribute } from '../contexts/ThemeContext';
import { FaHandsHelping } from "react-icons/fa";
import SearchAutoComplete from './SearchAutoComplete';

const HelpCenter = () => {
    // Define category data with placeholder content
    const categories = [
        {
            id: 'getting-started',
            icon: <FiArrowRight className="text-red-500 dark:text-red-400 w-6 h-6 mr-3" />,
            title: 'Getting Started',
            description: 'Learn how to get started with TaskJourney and navigate through basic functionalities.',
            linkText: 'Learn More',
            linkUrl: '/help/getting-started', // Replace with actual route
        },
        {
            id: 'account-management',
            icon: <FiUser className="text-green-500 dark:text-green-400 w-6 h-6 mr-3" />,
            title: 'Account Management',
            description: 'Manage your account settings, update personal information, and change your password.',
            linkText: 'Learn More',
            linkUrl: '/help/account-management', // Replace with actual route
        },
        {
            id: 'settings-preferences',
            icon: <FiSettings className="text-blue-500 dark:text-blue-400 w-6 h-6 mr-3" />,
            title: 'Settings and Preferences',
            description: 'Customize your TaskJourney experience, set preferences, and configure app settings.',
            linkText: 'Learn More',
            linkUrl: '/help/settings-preferences', // Replace with actual route
        },
        {
            id: 'troubleshooting',
            icon: <FiHelpCircle className="text-purple-500 dark:text-purple-400 w-6 h-6 mr-3" />,
            title: 'Troubleshooting',
            description: 'Find solutions to common issues, troubleshoot problems, and get assistance.',
            linkText: 'Learn More',
            linkUrl: '/help/troubleshooting', // Replace with actual route
        },
        {
            id: 'dashboard-features',
            icon: <FiGrid className="text-yellow-500 dark:text-yellow-400 w-6 h-6 mr-3" />,
            title: 'Dashboard & Features',
            description: 'Explore the features of TaskJourney dashboard and discover its capabilities.',
            linkText: 'Learn More',
            linkUrl: '/help/dashboard-features', // Replace with actual route
        },
        {
            id: 'contact-support',
            icon: <FaHandsHelping className="text-blue-500 dark:text-blue-400 w-6 h-6 mr-3" />,
            title: 'Contact Support',
            description: 'Reach out to our support team for further assistance and inquiries.',
            linkText: 'Learn More',
            linkUrl: '/help/contact-support', // Replace with actual route
        },
    ];

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
                    <div className="container mx-auto text-center relative z-10 text-black dark:text-white flex flex-col justify-center max-md:mt-5 items-center lg:flex-row lg:items-center lg:justify-center lg:space-x-8">
                        <div>
                            <Image src="/Chat bubble.png" alt='Chat bubble Hero Image' className='w-full h-full' width={700} height={700} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 dark:bg-gray-800 py-10">
                    <div className="container mx-auto">
                        <div className="flex justify-center mb-10">
                            <SearchAutoComplete />
                        </div>

                        {/* Category Sections */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {categories.map(category => (
                                <div key={category.id} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-300 transition-border duration-300 hover:shadow-xl">
                                    <div className="flex items-center mb-4">
                                        {category.icon}
                                        <h3 className="text-xl font-bold font-inter">{category.title}</h3>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-lato">{category.description}</p>
                                    <a href={category.linkUrl} className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-300 flex items-center">
                                        {category.linkText} <FiArrowRight className="ml-2" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Footer />
            </ThemeProviderWithAttribute>
        </>
    );
};

export default HelpCenter;
