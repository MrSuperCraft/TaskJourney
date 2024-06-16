'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TabButtonProps {
    icon: JSX.Element;
    label: string;
    onClick: () => void;
    isLoading: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, onClick, isLoading }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            onClick();
        }
    };

    return (
        <motion.button
            className="flex items-center space-x-2 p-3 rounded-lg shadow-md cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:text-primary-brand-800 dark:hover:text-primary-brand-600 hover:shadow-md hover:bg-light-cyan focus:outline-none focus:ring-2 focus:ring-primary-brand-600"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onKeyDown={handleKeyPress}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={label}
            role="button"
            tabIndex={0} // Ensures button is focusable
        >
            {icon}
            <span className={`text-lg ${isHovered ? 'font-semibold' : 'font-normal'}`}>{label}</span>
        </motion.button>
    );
};

export default TabButton;
