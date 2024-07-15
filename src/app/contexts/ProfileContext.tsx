'use client';

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import useUserData from '../hooks/useUserData';

interface ProfileContextType {
    profilePic: string;
    setProfilePic: React.Dispatch<React.SetStateAction<string>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
    children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const [profilePic, setProfilePic] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const { user, userData } = useUserData();

    useEffect(() => {
        if (user && userData) {
            setUsername(userData.username || '');
            setProfilePic(userData.photoURL || '');
        } else {
            setUsername('');
            setProfilePic('');
        }
    }, [userData, user]);

    return (
        <ProfileContext.Provider value={{ profilePic, setProfilePic, username, setUsername }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext) as ProfileContextType;
