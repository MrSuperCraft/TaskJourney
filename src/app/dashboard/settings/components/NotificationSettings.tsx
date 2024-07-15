import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/app/firebase';
import OneSignal from 'react-onesignal';
import { Checkbox, Switch } from "@nextui-org/react";
import { changeTag } from "@/app/lib/OneSignalHelpers";
import { debounce } from "@/app/utils/debounce";

const AccountSettings: React.FC = () => {
    const { user } = useAuth();
    const userId = user?.uid || '';

    const [initialized, setInitialized] = useState(false);
    const [taskRemindersEnabled, setTaskRemindersEnabled] = useState<boolean>(false); // Initialize to null
    const [eventRemindersEnabled, setEventRemindersEnabled] = useState<boolean>(false); // Initialize to null
    const [updatesEnabled, setUpdatesEnabled] = useState<boolean>(false); // Initialize to null

    const savePlayerId = async (playerId: string) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            await setDoc(doc(db, 'users', currentUser.uid), { fcmToken: playerId }, { merge: true });
        }
    };

    const saveNotificationSettings = async (uid: string, settings: any) => {
        try {
            await setDoc(doc(db, `users/${uid}/settings/notificationsettings`), settings, { merge: true });
            console.log('Notification settings saved:', settings);
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    };

    const loadNotificationSettings = useCallback(async (uid: string) => {
        try {
            const docRef = doc(db, `users/${uid}/settings/notificationsettings`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const settings = docSnap.data();
                setTaskRemindersEnabled(settings?.taskRemindersEnabled);
                setEventRemindersEnabled(settings?.eventRemindersEnabled);
                setUpdatesEnabled(settings?.updatesEnabled);
                console.log('Loaded notification settings:', settings);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error loading notification settings:', error);
        } finally {
            setInitialized(true); // Set initialized after loading settings
        }
    }, []);

    const initializeOneSignal = async () => {
        try {
            await OneSignal.init({
                appId: process.env.NEXT_PUBLIC_ONESIGNAL_ID || '',
                promptOptions: {
                    slideDownPrompt: false,
                    customlink: {
                        enabled: true,
                        style: "button",
                        size: "medium",
                        color: {
                            button: '#066994',
                            text: '#FFFFFF',
                        },
                        text: {
                            subscribe: "Enable 🔔",
                            unsubscribe: "Disable Notifications 🔕",
                        },
                        unsubscribeEnabled: true,
                    }
                }
            });
            console.log('OneSignal initialized');

            OneSignal.User.PushSubscription.addEventListener('change', pushSubscriptionChangeListener);

            const currentUser = auth.currentUser;
            if (currentUser) {
                await OneSignal.login(currentUser.uid);
                savePlayerId(currentUser.uid);
            }
        } catch (error) {
            console.error('OneSignal initialization error:', error);
        }
    };

    useEffect(() => {
        if (!initialized && user) {
            initializeOneSignal();
        }
    }, [initialized, user, initializeOneSignal]);

    useEffect(() => {
        const fetchNotificationSettings = async () => {
            if (user) {
                await loadNotificationSettings(user.uid);
            }
        };

        if (user && !initialized) {
            fetchNotificationSettings();
        }
    }, [initialized, user, loadNotificationSettings]);

    const debouncedSaveNotificationSettings = useCallback(
        debounce((settings) => {
            if (user) {
                saveNotificationSettings(user.uid, settings);
            }
        }, 6000),
        [user]
    );

    useEffect(() => {
        if (initialized && user) {
            const settings = {
                taskRemindersEnabled: taskRemindersEnabled || false,
                eventRemindersEnabled: eventRemindersEnabled || false,
                updatesEnabled: updatesEnabled || false,
            };
            console.log('Saving settings:', settings);
            debouncedSaveNotificationSettings(settings);
        }
    }, [taskRemindersEnabled, eventRemindersEnabled, updatesEnabled, initialized, user, debouncedSaveNotificationSettings]);

    const pushSubscriptionChangeListener = async (event: any) => {
        if (event.current.token) {
            console.log('The push subscription has received a token!');
            const currentUser = auth.currentUser;
            if (currentUser) {
                await OneSignal.login(currentUser.uid);
                OneSignal.User.addAlias('firebase_uid', currentUser.uid);
            }
        }
    };

    const handleTagChange = useCallback(
        (tag: string, value: string) => {
            if (user) {
                changeTag(tag, value, user.uid);
                console.log(`Tag changed: ${tag} -> ${value}`);
            }
        },
        [user]
    );

    useEffect(() => {
        if (initialized && user) {
            handleTagChange('task_reminders', taskRemindersEnabled ? 't' : 'f');
        }
    }, [taskRemindersEnabled, initialized, user, handleTagChange]);

    useEffect(() => {
        if (initialized && user) {
            handleTagChange('event_reminders', eventRemindersEnabled ? 't' : 'f');
        }
    }, [eventRemindersEnabled, initialized, user, handleTagChange]);

    useEffect(() => {
        if (initialized && user) {
            handleTagChange('updates', updatesEnabled ? 't' : 'f');
        }
    }, [updatesEnabled, initialized, user, handleTagChange]);

    const handleTaskRemindersToggle = () => {
        if (taskRemindersEnabled !== null) {
            setTaskRemindersEnabled(prevState => !prevState);
        }
    };

    const handleEventRemindersToggle = () => {
        if (eventRemindersEnabled !== null) {
            setEventRemindersEnabled(prevState => !prevState);
        }
    };

    const handleUpdatesToggle = () => {
        if (updatesEnabled !== null) {
            setUpdatesEnabled(prevState => !prevState);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>

            {initialized && (
                <>
                    <div className="mb-4 flex items-center">
                        <Switch
                            isSelected={taskRemindersEnabled || false} // Default to false if still null
                            onValueChange={handleTaskRemindersToggle}
                        >
                            <span>Task Reminders</span>
                        </Switch>
                    </div>

                    <div className="mb-4 flex items-center">
                        <Switch
                            isSelected={eventRemindersEnabled || false} // Default to false if still null
                            onValueChange={handleEventRemindersToggle}
                        >
                            Event Reminders
                        </Switch>
                    </div>

                    <div className="mb-4 flex items-center">
                        <Switch
                            isSelected={updatesEnabled || false} // Default to false if still null
                            onValueChange={handleUpdatesToggle}
                        >
                            Updates and News
                        </Switch>
                    </div>

                    <p className="text-gray-500 mb-4">* Note: If the notification toggle button isn&apos;t present, refresh the page.
                        <br /> If it doesn&apos;t work, move to a different page and refresh on there, then come back and refresh twice.
                        <br /> If it ain&apos;t that, then it&apos;s the library&apos;s fault. Sorry for the inconvenience 😔
                    </p>
                    <div className='onesignal-customlink-container'></div>
                </>
            )}
        </div>
    );
};

export default AccountSettings;
