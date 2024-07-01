'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
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


// Function to generate a 6-digit code
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email: string, verificationCode: string) => {
    try {

        sendEmail(email, verificationCode);

    } catch (error) {
        console.error('Failed to send verification email:', error);
    }
};

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const auth = getAuth();
            const provider = new GoogleAuthProvider();

            // Sign in with Google popup
            const result = await signInWithPopup(auth, provider);

            // After successful Google sign-in
            const { uid, email } = result.user;

            // Retrieve user information from Firestore
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Check if the user is verified
                if (!userData?.verified) {
                    throw new Error('Verify your account, check your email.');
                }
            } else {
                // If user does not exist in Firestore, this is a first-time signup
                const verificationCode = generateCode();

                // Store the code in Firestore with an expiration time
                const codeExpiration = new Date();
                codeExpiration.setHours(codeExpiration.getHours() + 1); // Code valid for 1 hour
                await setDoc(doc(db, 'emailVerificationCodes', email!), {
                    code: verificationCode,
                    expiresAt: codeExpiration,
                });

                // Send verification email
                await sendVerificationEmail(email!, verificationCode);

                throw new Error('Verify your account, check your email.');
            }

            // Redirect to the dashboard after successful login
            router.push('/dashboard');
        } catch (error) {
            setError((error as Error).message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-300 via-sky-blue to-teal dark:from-dark-teal dark:via-sky-blue dark:to-dark-primary-brand">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-3xl mx-8 md:max-w-6xl min-h-[600px] md:mx-auto flex flex-col md:flex-row">
                    <div className="md:w-3/5 bg-primary-brand hidden md:block">
                        <Image src="/login.svg" alt="login" width={800} height={400} className="object-cover w-full h-full" />
                    </div>
                    <div className="md:hidden w-full flex justify-center bg-primary-brand p-4">
                        <Image src="/android-chrome-192x192.png" alt="TaskJourney Logo" width={160} height={160} className="object-cover w-40 h-40" />
                    </div>

                    <div className="w-full md:w-2/5 p-8 my-auto mt-0 md:mt-auto">
                        <h2 className="lg:text-5xl text-3xl max-sm:text-2xl font-bold mb-2 text-center font-inter">Welcome Back!</h2>
                        <h2 className="lg:text-2xl md:text-lg sm:text-md mb-6 text-center font-lato">Log in to your dashboard.</h2>

                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                        <div className="mt-4 flex justify-center items-center">
                            <Button color="default" variant="bordered" className="flex items-center space-x-2" onClick={handleGoogleLogin} isLoading={loading}>
                                <FaGoogle />
                                <span>Sign in with Google</span>
                            </Button>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-gray-600 dark:text-gray-300">
                                Don&apos;t have an account?
                                <Link href="/signup">
                                    <span className="text-teal dark:text-primary-brand-light hover:underline ml-2">
                                        Sign up today
                                    </span>
                                </Link>
                            </span>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-gray-600 dark:text-gray-300">
                                By using this website, you are accepting our <Link href="/terms-of-service"><span className="text-teal dark:text-primary-brand-600 hover:underline">Terms of Service</span></Link> and <Link href="/privacy-policy"><span className="text-teal dark:text-primary-brand-600 hover:underline">Privacy Policy</span></Link>.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
