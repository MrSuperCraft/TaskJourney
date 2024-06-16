'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated import
import { useSearchParams } from 'next/navigation';
import { FaTasks } from 'react-icons/fa';
import Navbar from '../components/Navbar/Navbar';
import { NextUIProvider } from '@nextui-org/system';
import { ThemeProviderWithAttribute } from "../contexts/ThemeContext";
import { Spinner } from '@nextui-org/react';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const VerifyEmail = () => {
    const router = useRouter();
    const encodedEmail: string = useSearchParams().get('email') ?? 'something@example.com';
    const email = decodeURIComponent(encodedEmail);
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        try {
            setLoading(true);

            // Validate the verification code locally
            if (!verificationCode || verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
                setError('Invalid verification code format');
                setLoading(false);
                return;
            }

            // Call the backend to validate the verification code
            await checkCode(email, verificationCode, setError);

            console.log('Email verified successfully');
            setLoading(false);
            router.push('/login');
        } catch (error: any) {
            setError(error.message || 'Failed to verify email');
            setLoading(false);
        }
    };

    return (
        <ThemeProviderWithAttribute>
            <NextUIProvider>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 to-teal-200 dark:from-dark-navy-blue dark:to-dark-cyan">
                    <div className="bg-white dark:bg-dark-cyan rounded-lg shadow-lg p-8 max-sm:p-4 max-md:p-6 w-full max-w-md">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center mb-4">
                                <FaTasks className='w-12 h-12 text-black dark:text-white' />
                                <span className="ml-2 text-4xl font-bold text-black dark:text-light-cyan">TaskJourney</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4 text-dark-primary-brand dark:text-light-cyan">Verify Your Email</h1>
                            <p className="mb-6 text-teal dark:text-white text-center">Enter the verification code sent to your email.</p>
                        </div>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Verification Code"
                            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-primary-brand dark:focus:ring-light-cyan"
                        />
                        {error && <p className="text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>}
                        <button
                            onClick={handleVerify}
                            className="w-full bg-dark-cyan dark:bg-light-cyan text-white dark:text-navy-blue p-2 rounded hover:bg-dark-primary-brand dark:hover:bg-darker-cyan font-bold dark:hover:text-white transition-all duration-200"
                        >
                            {loading ? <Spinner color='secondary' /> : "Verify"}
                        </button>
                    </div>
                    <p className="mt-4 text-teal-600 dark:text-teal-400">Didn&apos;t receive the email? <a href="/resend" className="text-primary-brand dark:text-light-cyan hover:underline">Resend</a></p>
                </div>
            </NextUIProvider>
        </ThemeProviderWithAttribute>
    );
};

export default VerifyEmail;

async function checkCode(email: string, verificationCode: string, setError: (error: string | null) => void) {
    try {
        // Access the document directly by its ID (email)
        const verificationDocRef = doc(db, 'emailVerificationCodes', email);
        const verificationDocSnap = await getDoc(verificationDocRef);

        if (!verificationDocSnap.exists()) {
            setError("Verification code not found");
            return; // Exit the function early if the document doesn't exist
        }

        const verificationData = verificationDocSnap.data();

        // Ensure verificationData is defined before accessing its properties
        if (!verificationData || verificationData.code !== verificationCode) {
            setError("Verification code incorrect");
            return; // Exit the function early if the verification code is incorrect
        }

        // Query the users collection to find the user document by email
        const usersQuery = query(collection(db, 'users'), where('email', '==', email));
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
            setError("User not found");
            return; // Exit the function early if no user is found
        }

        // Assume there is only one user document with the given email
        const userDoc = usersSnapshot.docs[0];
        const userRecordRef = doc(db, 'users', userDoc.id);

        // Update the user's verified status in Firestore
        await updateDoc(userRecordRef, { verified: true });

        // Delete the verification code document from the collection
        await deleteDoc(verificationDocRef);

        console.log("Email verified successfully");
        setError(null); // Clear any previous errors
    } catch (error) {
        console.error('Error verifying email:', error);
        setError('Error verifying email');
    }
}
