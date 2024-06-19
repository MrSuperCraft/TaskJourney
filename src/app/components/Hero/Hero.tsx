'use client';


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroImage from './HeroImage';
import Image from 'next/image'
import Link from 'next/link';

const Hero: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (

        <div className="relative w-full h-screen flex flex-col justify-center items-center">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <Image
                    src="/hero.svg"
                    alt="Grainy Gradient SVG"
                    layout="fill"  // Preserve your custom size and positioning
                    objectFit="cover"  // Adjust as needed for your design
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
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <HeroImage
                        src="./note-taking-63.svg" // Replace with the path to your image
                        alt="Note Taking SVG"
                        ariaLabel="Note Taking Icon"
                        className={`w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] mb-4 ${isMobile ? 'lg:mb-0' : ''}`}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">TaskJourney</h1>
                    <p className="text-lg md:text-xl mb-6">Your journey to productivity and achievement starts here.</p>
                    {/* CTA Button */}
                    <Link href="/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            Get Started
                        </motion.button>
                    </Link>
                    {/* Add buttons or other elements as needed */}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <HeroImage
                        src="./note-taking-1-3.svg" // Replace with the path to your image
                        alt="Note Taking SVG"
                        ariaLabel="Note Taking Icon"
                        className={`w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] ${isMobile ? '' : 'lg:mb-0'}`}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
