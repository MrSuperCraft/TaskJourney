// components/Loading.tsx
import React from 'react';
import { ThemeProviderWithAttribute } from './contexts/ThemeContext';

const Loading: React.FC = () => {


    const spinnerStyle = `animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 dark:border-teal-500 border-cyan-500`;

    return (
        <ThemeProviderWithAttribute>
            <div className="flex items-center flex-col justify-center h-screen bg-gray-50 dark:bg-gray-500">
                <div className={spinnerStyle}></div>
                <p className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">
                    Loading...
                </p>
            </div>
        </ThemeProviderWithAttribute>
    );
};

export default Loading;
