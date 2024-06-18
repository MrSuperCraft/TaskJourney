import React from 'react';
import { Image } from '@nextui-org/react';

const FutureVisionSection = () => {
    return (
        <div className="transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2 font-inter text-primary-brand-700 dark:text-primary-brand-300">Looking Ahead</h2>
                <p className="text-lg sm:text-base md:text-lg lg:text-lg xl:text-xl font-lato text-gray-600 dark:text-gray-300">
                    As I look to the future, TaskJourney envisions a world where
                    organization and productivity are effortless, where individuals are
                    empowered to achieve their dreams. Join me on this journey of
                    transformation and discover the endless possibilities with TaskJourney.
                </p>
                <Image src="/future.jpg" isBlurred alt="Future Vision Image" width={800} height={450} className="rounded-lg shadow-md mt-4" />
            </div>
        </div>
    );
};

export default FutureVisionSection;
