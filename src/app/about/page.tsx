'use client';

// Import necessary libraries
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { ThemeProviderWithAttribute } from '../contexts/ThemeContext';
import Image from 'next/image';
import Footer from '../components/Footer/Footer';
import { FaArrowUp } from 'react-icons/fa';
import IntroductionSection from './components/IntroSection';
import PersonalJourneySection from './components/PersonalJourneySection';
import MissionGoalsSection from './components/MissionGoalsSection';
import LearningInnovationSection from './components/LearningInnovationSection';
import FutureVisionSection from './components/FutureVisionSection';
import { motion } from 'framer-motion';
import Timeline from './components/Timeline';
import Head from 'next/head';


// AboutMePage component
const AboutMePage = () => {
    const [showGoToTop, setShowGoToTop] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        const scrollListener = () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (document.documentElement.scrollTop / totalHeight) * 100;
            setReadingProgress(scrollPercentage);
            setShowGoToTop(document.documentElement.scrollTop > 100);
        };

        window.addEventListener('scroll', scrollListener);
        return () => window.removeEventListener('scroll', scrollListener);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [title, setTitle] = useState('Default Title');

    // Example of setting title dynamically based on some client-side logic
    useEffect(() => {
        const newTitle = 'About Us | TaskJoruney';
        setTitle(newTitle);
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Discover the story of TaskJourney and the impact it has on our community. Find more information about how this project began and what is the vision behind it." />
            </Head>
            <ThemeProviderWithAttribute>
                <Navbar />
                <div className="relative w-full min-h-screen flex flex-col items-center justify-start pt-20 pb-10">
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        <Image
                            src="/hero.svg"
                            alt="Grainy Gradient SVG"
                            layout="fill"
                            objectFit="cover"
                            className="opacity-80 mix-blend-soft-light"
                        />
                    </div>
                    <div className="about-page bg-primary-brand-50 dark:bg-gray-900 text-gray-800 dark:text-primary-brand-50 p-6 rounded-lg shadow-lg relative z-10 mt-20 mb-10 mx-4 max-w-3xl w-full">
                        {/* Story sections */}
                        <section className="py-8 px-4 space-y-8">
                            {/* Introduction */}
                            <IntroductionSection />

                            {/* Personal Journey */}
                            <PersonalJourneySection />

                            {/* Mission and Goals */}
                            <MissionGoalsSection />

                            {/* Learning and Innovation */}
                            <LearningInnovationSection />

                            {/* Future Vision */}
                            <FutureVisionSection />

                            {/* Timeline */}

                            <Timeline />


                        </section>
                    </div>
                </div>
                {/* "Go to top" button */}
                {showGoToTop && (
                    <button
                        className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-full p-3 shadow-lg z-50 transition-opacity duration-300 ease-in-out hover:opacity-80"
                        onClick={scrollToTop}
                    >
                        <FaArrowUp />
                    </button>
                )}
                {/* Progress bar */}
                <motion.div
                    className="fixed top-24 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-800 z-50"
                    style={{ width: `${readingProgress}%` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.5 }}
                />
                <Footer />
            </ThemeProviderWithAttribute>
        </>
    );
};

export default AboutMePage;
