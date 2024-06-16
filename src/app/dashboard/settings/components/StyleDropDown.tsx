import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../.././../firebase'; // adjust the path to your firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { Selection } from '@react-types/shared';

const ThemeSettings: React.FC = () => {
    const [themePack, setThemePack] = useState('default');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchSettings = async () => {
                const docRef = doc(db, 'users', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.themeSettings) {
                        setThemePack(data.themeSettings.themePack);
                    }
                }
            };
            fetchSettings();
        }
    }, [userId]);

    const handleThemePackChange = async (selection: Selection) => {
        const selectedThemePack = Array.from(selection).join('');
        setThemePack(selectedThemePack);
        if (userId) {
            const docRef = doc(db, 'users', userId);
            await setDoc(docRef, { themeSettings: { themePack: selectedThemePack } }, { merge: true });
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Level Rewards</h2>

            <Select
                selectedKeys={new Set([themePack])}
                onSelectionChange={handleThemePackChange}
                placeholder="Select a theme pack"
            >
                <SelectItem key="default" value="default">Default</SelectItem>
                <SelectItem key="theme1" value="theme1">Theme Pack 1</SelectItem>
                <SelectItem key="theme2" value="theme2">Theme Pack 2</SelectItem>
                {/* Add more theme packs as needed */}
            </Select>
        </div>
    );
};

export default ThemeSettings;
