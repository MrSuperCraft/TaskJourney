import React from 'react';
import { Metadata } from 'next';
import SettingsPage from './SettingsPage';


export const metadata: Metadata = {
    title: 'Settings',
    description: 'Change your settings, customize them to your liking and handle notification preferences.',
};


export default function Page() {
    return (
        <SettingsPage />
    )
}