// IntroductionSection.js

import React from 'react';
import { Image } from "@nextui-org/image";

const IntroductionSection = () => {
    return (
        <div className="transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-4xl font-bold mb-2 font-inter text-primary-brand-700 dark:text-primary-brand-300">The Genesis of TaskJourney</h1>
                <p className="text-lg sm:text-base md:text-lg lg:text-lg xl:text-xl font-lato text-gray-600 dark:text-gray-300">
                    A Journey from Inspiration to Innovation
                </p>
                <Image isBlurred src="/task-list.jpg" alt="Intro Image" width={800} height={450} className="rounded-lg shadow-md mt-4" />
            </div>
        </div>
    );
};

export default IntroductionSection;
