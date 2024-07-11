// pages/contact.tsx

'use client';

import React from 'react';

import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { Divider } from '@nextui-org/react';
import ContactForm from './ContactForm';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';



const ContactPage = () => {
    return (
        <ThemeProviderWithAttribute>
            <div className="h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center mt-20 mb-10">
                    <div className="shadow-md rounded-md p-6 bg-white dark:bg-gray-800 w-full max-w-lg mx-auto mt-16">
                        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 text-center mb-4">
                            Get in touch
                        </h1>
                        <Divider className="mb-4" />
                        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string || ''}>
                            <ContactForm />
                        </GoogleReCaptchaProvider>
                    </div>
                </div>
                <Footer />

            </div>
        </ThemeProviderWithAttribute>
    );
};


export default ContactPage;
