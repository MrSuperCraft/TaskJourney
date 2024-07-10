// components/ThemeToggleButton.tsx
'use client';

import React, { useContext } from 'react';
import { Button } from '@nextui-org/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';
const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Button
            variant='shadow'
            className='fixed bottom-4 left-4 z-50 w-20 h-20 bg-slate-800 rounded-full hover:bg-slate-700 transition-all duration-300 text-white text-lg'
            onClick={toggleTheme}
            isIconOnly
        >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
    );
};

export default ThemeToggleButton;
