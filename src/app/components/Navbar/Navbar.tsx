
'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTasks, FaInfoCircle, FaEnvelope, FaMoon, FaSun, FaShoppingBag, FaHandsHelping, FaBlog } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext'
import { Spinner } from '@nextui-org/react';

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
                            <div className="flex items-center text-black dark:text-white font-bold text-xl cursor-pointer transition-colors duration-300">
                                <FaTasks className="w-6 h-6 mr-2 text-black dark:text-white" />
                                TaskJourney
                            </div>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <button
                                className="p-2 rounded-md text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
                            </button>

                            <Link href="/signup">
                                <button
                                    className="ml-4 px-4 py-2 rounded-full text-white bg-darker-cyan dark:bg-dark-cyan hover:bg-teal dark:hover:bg-dark-teal transition-colors duration-300"
                                    onClick={() => setClicked(true)}
                                >
                                    {clicked ? <Spinner color="primary" /> : "Sign Up"}
                                </button>
                            </Link>

                            <button
                                className="p-2 rounded-md text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
                                onClick={toggleSidebar}
                            >
                                {isSidebarOpen ? <AiOutlineClose className="w-6 h-6" /> : <AiOutlineMenu className="w-6 h-6" />}
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
                                {/* Additional categories */}
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
