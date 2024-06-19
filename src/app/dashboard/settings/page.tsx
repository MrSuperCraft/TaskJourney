// pages/settings.tsx
'use client';
import Sidebar from '../components/sidebar/Sidebar';
import ThemeSettings from './components/ThemeSettings';
import AccountSettings from './components/Account Settings/AccountSettings';
import NotificationSettings from './components/NotificationSettings';
import { ThemeProviderWithAttribute } from '../../contexts/ThemeContext';
import useUserData from '../../hooks/useUserData';
import { useRouter } from 'next/navigation'
import Loading from "../../Loading";
import { Divider } from '@nextui-org/react';
import { ProfileProvider } from '@/app/contexts/ProfileContext';

const SettingsPage: React.FC = () => {
    const { loading, authenticated, user, userData } = useUserData();
    const router = useRouter();

    if (loading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }

    return (
        <ProfileProvider>
            <ThemeProviderWithAttribute>
                <div className="h-screen flex">
                    <Sidebar />
                    <div className="container px-4 py-8 ml-20 overflow-auto ">
                        <h1 className="text-3xl font-bold mb-8">Settings</h1>
                        <Divider></Divider>
                        <AccountSettings />
                        <ThemeSettings />
                        {/* Add more settings sections as needed */}
                    </div>
                </div>
            </ThemeProviderWithAttribute>
        </ProfileProvider>
    );
};

export default SettingsPage;
