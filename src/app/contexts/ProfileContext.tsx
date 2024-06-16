import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import useUserData from '../hooks/useUserData';
import { db } from '@/app/firebase';

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
    const { user } = useUserData();

    useEffect(() => {
        const fetchProfileDataFromFirestore = async () => {
            if (user && user.uid) {
                const profileRef = doc(db, 'users', user.uid);
                try {
                    const snapshot = await getDoc(profileRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setProfilePic(data?.photoURL || '');
                        setUsername(data?.username || '');
                    } else {
                        console.log('Profile document does not exist');
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            }
        };

        fetchProfileDataFromFirestore();
    }, [user]);

    return (
        <ProfileContext.Provider value={{ profilePic, setProfilePic, username, setUsername }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext) as ProfileContextType;
