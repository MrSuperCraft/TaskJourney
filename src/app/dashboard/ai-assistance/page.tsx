
'use client';


import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import AIChat from './components/AiChat';
import AiChat from './components/AiChat';

const AiPage = () => {
    return (
        <>
            <ProfileProvider>
                <ThemeProviderWithAttribute>
                    <div className="h-screen flex">
                        <Sidebar />
                        <div className="container px-4 py-8 sm:ml-10 md:ml-16 lg:ml-20 overflow-auto ">
                            <AiChat />
                            {/* Add more settings sections as needed */}
                        </div>
                    </div>
                </ThemeProviderWithAttribute>
            </ProfileProvider>

        </>
    )
}

export default AiPage;