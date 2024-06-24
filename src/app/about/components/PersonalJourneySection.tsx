import React from 'react';
import { Image } from '@nextui-org/react';

const PersonalJourneySection = () => {
    return (
        <div className=" duration-500 ease-in-out ">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2 font-inter text-primary-brand-700 dark:text-primary-brand-300">My Personal Journey with TaskJourney</h2>
                <p className="text-lg sm:text-base md:text-lg lg:text-lg xl:text-xl font-lato text-gray-600 dark:text-gray-300">
                    Like many developers, I struggled with task organization. Juggling between
                    calendars, memory aids, and timers on my phone, I realized the
                    inefficiency of scattered tools. It was this personal struggle that
                    fueled my determination to create what I couldn&apos;t find—a comprehensive
                    solution that brings everything together.
                </p>
                <Image src="/journey.jpg" isBlurred alt="Personal Journey Image" width={800} height={200} className="rounded-lg shadow-md mt-4" />
            </div>
        </div>
    );
};

export default PersonalJourneySection;
