'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTasks, FaInfoCircle, FaEnvelope, FaMoon, FaSun, FaShoppingBag, FaHandsHelping, FaBlog } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Spinner, Button } from '@nextui-org/react';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full z-50 transition-all duration-300"
            >
                <div className="w-full h-[100px] fixed bg-primary-brand-600 dark:bg-dark-primary-brand shadow-lg transition-colors duration-300">
                    <div className="flex justify-between items-center h-full px-6">
                        <Link href="/">
                            <div className="flex items-center text-black dark:text-white font-bold text-lg sm:text-xl cursor-pointer transition-colors duration-300">
                                <FaTasks className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-black dark:text-white" />
                                <span className="text-base sm:text-xl">TaskJourney</span>
                            </div>
                        </Link>

                        <div className="flex items-center space-x-2 sm:space-x-4">

                            <Button
                                isIconOnly
                                variant="shadow"
                                className="p-1 sm:p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ? <FaMoon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-700" /> : <FaSun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
                            </Button>


                            <Link href="/signup">
                                <button
                                    className="ml-2 sm:ml-4 px-3 sm:px-4 py-1 sm:py-2 max-sm:py-2 rounded-full text-white bg-darker-cyan dark:bg-dark-cyan hover:bg-teal dark:hover:bg-dark-teal transition-colors duration-300 min-w-[120px] sm:min-w-[100px] max-sm:min-w-[80px]"
                                    onClick={() => setClicked(true)}
                                >
                                    {clicked ? <Spinner color="default" /> : "Sign Up"}
                                </button>
                            </Link>

                            <button
                                className="p-1 sm:p-2 rounded-md text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                                onClick={toggleSidebar}
                            >
                                {isSidebarOpen ? <AiOutlineClose className="w-4 h-4 sm:w-6 sm:h-6" /> : <AiOutlineMenu className="w-4 h-4 sm:w-6 sm:h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: '0%' }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-[100px] right-0 h-[calc(100vh-100px)] w-64 bg-white dark:bg-gray-800 shadow-lg z-40 flex flex-col justify-between transition-colors duration-300"
                        >
                            <div className="flex flex-col px-6 py-4 space-y-4 mb-6">
                                <Link href="/about">
                                    <div className="flex items-center text-black dark:text-white py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <FaInfoCircle className="mr-2" />
                                        About
                                    </div>
                                </Link>
                                <Link href="/contact">
                                    <div className="flex items-center text-black dark:text-white py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <FaEnvelope className="mr-2" />
                                        Contact
                                    </div>
                                </Link>
                                <Link href="/products">
                                    <div className="flex items-center text-black dark:text-white py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <FaShoppingBag className="mr-2" />
                                        Products
                                    </div>
                                </Link>
                                <Link href="/services">
                                    <div className="flex items-center text-black dark:text-white py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <FaHandsHelping className="mr-2" />
                                        Services
                                    </div>
                                </Link>
                                <Link href="/blog">
                                    <div className="flex items-center text-black dark:text-white py-2 cursor-pointer hover:text-blue-600 transition-colors duration-300">
                                        <FaBlog className="mr-2" />
                                        Blog
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </AnimatePresence>
    );
};

export default Navbar;
