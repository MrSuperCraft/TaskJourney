import React from 'react';
import { Image } from '@nextui-org/react';

const MissionGoalsSection = () => {
    return (
        <div className=" duration-500 ease-in-out">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2 font-inter text-primary-brand-700 dark:text-primary-brand-300">My Mission and Goals</h2>
                <p className="text-lg sm:text-base md:text-lg lg:text-lg xl:text-xl font-lato text-gray-600 dark:text-gray-300">
                    TaskJourney&apos;s mission is simple yet profound: to provide a user-friendly,
                    all-in-one platform for organization, productivity, and personal growth.
                    My goals include enhancing user experience, integrating cutting-edge
                    technologies like AI, and promoting a seamless workflow.
                </p>
                <Image src="/mission.jpg" isBlurred alt="Mission Image" width={800} height={450} className="rounded-lg shadow-md mt-4" />
            </div>
        </div>
    );
};

export default MissionGoalsSection;
