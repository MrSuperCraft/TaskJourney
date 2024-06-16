'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { db, storage } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
    Input, User, Divider, Button, Select, Radio, RadioGroup, SelectItem, SelectSection
} from '@nextui-org/react';
import { FaUpload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from '@/app/utils/debounce';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useProfile } from '@/app/contexts/ProfileContext';
import { query, collection, where, getDocs } from 'firebase/firestore';

const AccountSettings: React.FC = () => {
    const { user } = useAuth();
    const { profilePic, setProfilePic, username, setUsername } = useProfile();
    const [userData, setUserData] = useState<any>({
        username: '',
        email: '',
        timeZone: '',
        visibility: '',
        description: '',
        photoURL: profilePic
    });
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userId = user.uid;
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    console.log(data.timeZone)
                    setSelectedTimeZone(data.timeZone || ''); // Set selectedTimeZone from user data
                    setUserData((prevData: any) => ({
                        ...prevData,
                        email: data.email || '',
                        description: data.description || '',
                        visibility: data.visibility || '',
                        timeZone: data.timeZone || '',
                    }));
                }
            }
        };


        fetchUserData();
    }, [user]);

    useEffect(() => {
        setUserData((prevData: any) => ({
            ...prevData,
            photoURL: profilePic,
            username: username
        }));
    }, [profilePic, username]);

    const handleInputChange = (field: string, value: any) => {
        setUserData((prevData: any) => ({
            ...prevData,
            [field]: value,
        }));
        if (field === 'username') {
            setUsernameError(null); // Reset username error when user starts typing
        }
    };

    const handleTimeZoneChange = (value: string) => {
        setSelectedTimeZone(value);
        setUserData((prevData: any) => ({
            ...prevData,
            timeZone: value
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
        handleUploadImage(file || null); // Pass the file to handleUploadImage
    };

    const handleUploadImage = async (file: File | null) => {
        if (file && user) {
            try {
                const userId = user.uid;
                const storageRef = ref(storage, `profile-images/${userId}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on('state_changed', null, null, async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    setUserData((prevData: any) => ({
                        ...prevData,
                        photoURL: downloadURL
                    }));
                    setProfilePic(downloadURL); // Update profile picture URL globally
                    await saveUserData({ ...userData, photoURL: downloadURL });
                    setSelectedFile(null);
                });
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image.', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    const checkUsernameAvailability = async (username: string): Promise<boolean> => {
        const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
        const usernameSnapshot = await getDocs(usernameQuery);
        return usernameSnapshot.empty;
    };

    const saveUserData = async (data: any) => {
        if (user) {
            if (data.username.trim().length === 0) {
                setUsernameError('Username cannot be empty.');
                toast.error('Username cannot be empty.', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            try {
                const userId = user.uid;
                const userDocRef = doc(db, 'users', userId);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    const currentUsername = userData.username || ''; // Get current username from Firestore
                    if (data.username !== currentUsername) {
                        const isUsernameAvailable = await checkUsernameAvailability(data.username);
                        if (!isUsernameAvailable) {
                            setUsernameError('Username is already taken.');
                            toast.error('Username is already taken.', {
                                position: "bottom-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            return;
                        }
                    }
                }

                await setDoc(userDocRef, data, { merge: true });
                setUsername(data.username); // Update username in context
                toast.success('Changes saved successfully!', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch (error) {
                console.error('Error saving data:', error);
                toast.error('Failed to save changes.', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };




    const debouncedSaveUserData = useCallback(
        debounce((data) => saveUserData(data), 6000),
        []
    );

    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            debouncedSaveUserData(userData);
        }
    }, [userData, debouncedSaveUserData]);

    return (
        <div className="mb-6">
            <ToastContainer />
            <h2 className="text-2xl font-semibold mb-4 mt-4">Account Settings</h2>
            <div className="flex items-center mb-6">
                {/* Profile Picture */}
                <User
                    name={userData.username}
                    description="Profile picture should be JPG or PNG, less than 1MB"

                    avatarProps={{
                        src: userData.photoURL || (user && user.photoURL) || '', style: { width: '100px', height: '100px' },
                        className: 'border shadow-md' // Adjust the width and height as needed
                    }}
                    className="mr-4"
                    classNames={{
                        name: 'text-lg font-semibold'
                    }}

                />

                {/* Upload Button */}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <Button className="bg-gray-200 text-black flex items-center" aria-label="Upload Image"
                        onClick={() => fileInputRef.current?.click()}>
                        <FaUpload className="mr-2" /> Upload Image
                    </Button>
                </div>
            </div>

            <Divider className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <span className="text-lg mb-2">Display Name</span>
                    <Input
                        type="text"
                        className="border rounded-xl"
                        value={userData.username || ''}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                    />
                    {usernameError && <p className="text-red-500 mt-2">{usernameError}</p>}
                </div>

                <div className="flex flex-col">
                    <span className="text-lg mb-2">Email</span>
                    <Input
                        type="text"
                        className="border rounded-xl"
                        value={userData.email || ''}
                        disabled
                    />
                </div>
            </div>

            <div className="mt-6">
                <span className="text-lg mb-2">Time Zone</span>
                <Select
                    selectedKeys={selectedTimeZone ? [selectedTimeZone] : []}
                    className="border rounded-xl overflow-auto max-h-[150px]"
                    placeholder="Select your time zone"
                    value={selectedTimeZone}
                    onChange={(event) => handleTimeZoneChange(event.target.value)} // Extract value from event
                    aria-label='Select your time zone'
                    classNames={{
                        listbox: 'overflow-y-auto max-h-[200px]',
                        label: 'text-black text-lg font-bold font-inter'
                    }}
                >
                    {/* Americas */}
                    <SelectSection showDivider title="Americas">
                        <SelectItem key="PST" value="PST" description="Pacific Standard Time" aria-label='Pacific Standard Time'>
                            PST - UTC-8
                        </SelectItem>
                        <SelectItem key="MST" value="MST" description="Mountain Standard Time" aria-label='Mountain Standard Time'>
                            MST - UTC-7
                        </SelectItem>
                        <SelectItem key="CST" value="CST" description="Central Standard Time" aria-label="Central Standard Time">
                            CST - UTC-6
                        </SelectItem>
                        <SelectItem key="EST" value="EST" description="Eastern Standard Time" aria-label='Eastern Standard Time'>
                            EST - UTC-5
                        </SelectItem>
                    </SelectSection>

                    {/* Europe */}
                    <SelectSection showDivider title="Europe">
                        <SelectItem key="GMT" value="GMT" description="Greenwich Mean Time" aria-label='Greenwich Mean Time'>
                            GMT - UTC+0
                        </SelectItem>
                        <SelectItem key="CET" value="CET" description="Central European Time" aria-label='Central European Time'>
                            CET - UTC+1
                        </SelectItem>
                        <SelectItem key="EET" value="EET" description="Eastern European Time" aria-label='Eastern European Time'>
                            EET - UTC+2
                        </SelectItem>
                    </SelectSection>

                    {/* Asia */}
                    <SelectSection showDivider title="Asia">
                        <SelectItem key="IST" value="IST" description="Indian Standard Time" aria-label='Indian Standard Time'>
                            IST - UTC+5:30
                        </SelectItem>
                        <SelectItem key="CSTAsia" value="CSTAsia" description="China Standard Time" aria-label='China Standard Time'>
                            CST - UTC+8
                        </SelectItem>
                        <SelectItem key="JST" value="JST" description="Japan Standard Time" aria-label='Japan Standard Time'>
                            JST - UTC+9
                        </SelectItem>
                    </SelectSection>

                    {/* Other Regions */}
                    <SelectSection showDivider title="Other Regions">
                        <SelectItem key="NZST" value="NZST" description="New Zealand Standard Time" aria-label='New Zealand Standard Time'>
                            NZST - UTC+12
                        </SelectItem>
                        <SelectItem key="HAST" value="HAST" description="Hawaii-Aleutian Standard Time" aria-label='Hawaii-Aleutian Standard Time'>
                            HAST - UTC-10
                        </SelectItem>
                    </SelectSection>
                </Select>
            </div>

            <div className="mt-6">
                <span className="text-lg mb-2">Profile Visibility</span>
                <RadioGroup
                    label="Select visibility to other users"
                    defaultValue='Public'
                    value={userData.visibility || 'Public'}
                    color='success'
                    onChange={(event) => handleInputChange('visibility', event?.target.value)}
                    aria-label='Select visibility to other users'
                >
                    <Radio value="Public" aria-label='Public'>Public</Radio>
                    <Radio value="Friends Only" aria-label='Friends Only'>Friends Only</Radio>
                    <Radio value="Private" aria-label='Private'>Private</Radio>
                </RadioGroup>
            </div>

            <div className="mt-6">
                <span className="text-lg mb-2">Description</span>
                <Input
                    className="border rounded-xl w-full"
                    value={userData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    aria-label='Enter a Description'
                />
            </div>

            <Divider className="mt-6" />
        </div>
    );
};

export default AccountSettings;
