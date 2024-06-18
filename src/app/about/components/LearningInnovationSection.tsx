import React from 'react';
import { Image } from '@nextui-org/react';

const LearningInnovationSection = () => {
    return (
        <div className="transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2 font-inter text-primary-brand-700 dark:text-primary-brand-300">Innovating with AI and Modern Technology</h2>
                <p className="text-lg sm:text-base md:text-lg lg:text-lg xl:text-xl font-lato text-gray-600 dark:text-gray-300">
                    One of the exciting aspects of TaskJourney is its integration of AI and
                    modern technology. This isn&apos;t just about innovation; it&apos;s about learning
                    and staying ahead in the ever-evolving programming scene. TaskJourney
                    provides a unique behind-the-scenes experience, where every line of code
                    is a step forward in mastering the art of modern programming.
                </p>
                <Image src="/ai.jpg" isBlurred alt="Innovation Image" width={800} height={450} className="rounded-lg shadow-md mt-4" />
            </div>
        </div>
    );
};

export default LearningInnovationSection;
