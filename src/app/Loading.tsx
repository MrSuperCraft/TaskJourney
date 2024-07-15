'use client'

import React from 'react';
import Image from 'next/image';
import { ThemeProviderWithAttribute } from './contexts/ThemeContext';

const Loading: React.FC = () => {

    return (
        <ThemeProviderWithAttribute>
            <div className="flex items-center flex-col justify-center h-screen bg-gray-50 dark:bg-gray-800">
                <Image src="/android-chrome-192x192.png" alt="TaskJourney Logo" width={192} height={192} />

                <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 mt-8" />
                <p className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">
                    Loading...
                </p>

            </div>
        </ThemeProviderWithAttribute>
    );
};

export default Loading;

