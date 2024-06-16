'use client';

// components/settings/ThemeSettings.tsx
import { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import StyleDropDown from './StyleDropDown';

const ThemeSettings: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <>
            <h1>Theme Settings</h1>
            <ThemeToggle />
            {/*<StyleDropDown />*/}
        </>
    );
};

export default ThemeSettings;
