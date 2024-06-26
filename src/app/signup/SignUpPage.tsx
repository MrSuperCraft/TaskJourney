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
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import Head from 'next/head';



const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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

    // Define the type for the sendEmail function
    type SendEmailFunction = (email: string, verificationCode: string) => Promise<EmailJSResponseStatus>;

    const sendEmail: SendEmailFunction = async (email: string, verificationCode: string) => {
        const serviceID = process.env.NEXT_PUBLIC_SMTP_SERVICE || '';
        const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID || '';
        const userID = process.env.NEXT_PUBLIC_SMTP_UID || '';

        // Get the URLs for the images
        const tasksImageURL = `${process.env.NEXT_PUBLIC_BASE_URL}/tasks-solid.png`;
        const circleCheckImageURL = `${process.env.NEXT_PUBLIC_BASE_URL}/circle-check-solid.png`;

        const templateParams = {
            email: email,
            verification_code: verificationCode,
            tasks_image: tasksImageURL,
            circle_check_image: circleCheckImageURL,
        };

        try {
            // Send email using templateParams which include image URLs
            const response = await emailjs.send(serviceID, templateID, templateParams, userID);
            return response;
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    };

    const sendVerificationEmail = async (email: string) => {
        try {
            const verificationCode = generateCode();
            // add the code to the database under a "emailVerificationCodes" collection. 
            await setDoc(doc(db, "emailVerificationCodes", email), {
                email: email,
                code: verificationCode
            });

            await sendEmail(email, verificationCode);

        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Sign Up | TaskJourney</title>
                <meta name="description" content="Sign up for TaskJourney and start getting productive!" />
            </Head>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-300 via-sky-blue to-teal dark:from-dark-teal dark:via-sky-blue dark:to-dark-primary-brand">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-3xl mx-8 md:max-w-6xl min-h-[600px] md:mx-auto flex flex-col md:flex-row">
                    <div className="md:w-3/5 bg-primary-brand hidden md:block">
                        <Image src="/signup.svg" priority alt="Signup" width={800} height={400} className="object-cover w-full h-full" />
                    </div>
                    <div className="md:hidden w-full flex justify-center bg-primary-brand p-4">
                        <Image src="/android-chrome-192x192.png" priority alt="Signup" width={160} height={160} className="object-cover w-40 h-40" />
                    </div>
                    <div className="w-full md:w-2/5 p-8 my-auto mt-0 md:mt-auto">
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
        </>
    );
};

export default SignupPage;
