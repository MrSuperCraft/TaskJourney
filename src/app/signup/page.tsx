'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from 'next/image';
import { db } from '../firebase'; // Import Firestore instance
import Header from './SignupHeader';
import Buttons from './Buttons';
import Footer from './Footer';

const SignupPage = () => {
    const [error, setError] = useState<string | null>(null); // Update type to string | null
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const router = useRouter();

    const handleGoogleSignup = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        setIsLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const email = user.email ?? "user@example.com";

            // Check if the user already exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setError('User already exists. Please login to access your dashboard.');
                return;
            }

            // Add user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                lastLogin: new Date(),
                createdAt: new Date(),
                verified: false, // Mark the user as not fully verified initially
            });

            // Send verification email
            await sendVerificationEmail(email);

            console.log('Signed up with Google');
            router.push(`/confirm-email?email=${encodeURIComponent(email)}`); // Redirect to confirm-email page with email in query
        } catch (error: any) {
            console.error('Error signing up with Google:', error.message);
            setError(error.message || 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };

    const sendVerificationEmail = async (email: string) => {
        try {
            // Notify backend to send verification email
            const response = await fetch('/api/sendVerificationEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send verification code');
            }

            console.log('Verification email sent:', data.message);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-300 via-sky-blue to-teal dark:from-dark-teal dark:via-sky-blue dark:to-dark-primary-brand">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-3xl mx-8 md:max-w-6xl min-h-[600px] md:mx-auto flex">
                <div className="hidden md:block w-3/5 bg-primary-brand">
                    <Image src="/signup.svg" priority alt="Signup" width={800} height={400} className="object-cover w-full h-full" />
                </div>
                <div className="w-full md:w-2/5 p-8 my-auto">
                    <Header />
                    <div className="space-y-4">
                        <Buttons
                            handleGoogleSignup={handleGoogleSignup}
                            isLoading={isLoading} // Pass loading state
                            error={error} // Pass error state
                        />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

