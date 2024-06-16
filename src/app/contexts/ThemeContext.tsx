// themes/ThemeContext.tsx
'use client'
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;

}

const defaultValue: ThemeContextProps = {
    theme: 'light',
    toggleTheme: () => { },

};

export const ThemeContext = createContext<ThemeContextProps>(defaultValue);

export const useThemeContext = () => useContext(ThemeContext); // Export a custom hook for accessing the theme context

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [theme, setLocalTheme] = useState<string>('light');

    useEffect(() => {
        if (resolvedTheme) {
            setLocalTheme(resolvedTheme);
        }
    }, [resolvedTheme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setLocalTheme(newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{ theme: theme ?? 'light', toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const ThemeProviderWithAttribute: React.FC<ThemeProviderProps> = ({ children }) => {
    return (
        <NextThemesProvider attribute="class">
            <ThemeProvider>{children}</ThemeProvider>
        </NextThemesProvider>
    );
};

interface ThemeProviderProps {
    children: ReactNode;
}
