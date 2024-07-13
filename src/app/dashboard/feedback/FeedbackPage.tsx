'use client';

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Input, Textarea, Button, SelectItem, Select } from '@nextui-org/react';
import Sidebar from '../components/sidebar/Sidebar';
import { ThemeProviderWithAttribute } from '@/app/contexts/ThemeContext';
import { ProfileProvider } from '@/app/contexts/ProfileContext';
import { Divider } from '@nextui-org/react';
import Loading from '@/app/Loading';
import Link from 'next/link';
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import useUserData from '@/app/hooks/useUserData';
import { FaCheckCircle } from 'react-icons/fa';

const FeedbackForm = ({ email }: { email: string }) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_SECRET as string, {
        data: { "g-recaptcha-response": executeRecaptcha }
    });

    if (state.succeeded) {
        return (
            <div className="flex items-center justify-center mt-8 text-center">
                <div className="text-center text-gray-900 dark:text-gray-100 mt-4">
                    <FaCheckCircle className="text-6xl text-green-500 mb-4 mx-auto" /> {/* Displaying a check circle icon */}
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                        Thanks for providing useful feedback to TaskJourney!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Your feedback helps us improve our services and make TaskJourney even better for you.
                    </p>
                    <div className="mt-6">
                        <Link href="/dashboard">
                            <Button color='success' className='border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold' variant="bordered">
                                Continue Exploring TaskJourney
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    fullWidth
                    required
                    aria-label='email'
                    className="mt-1"
                    value={email}
                    isRequired
                    disabled={state.submitting}
                    placeholder='Please enter your email address'
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div className="flex flex-col">
                <label htmlFor="feedbackType" className="text-gray-700 dark:text-gray-300">Topic</label>
                <Select
                    id="feedbackType"
                    name="feedbackType"
                    fullWidth
                    aria-label='feedbackType'
                    required
                    isRequired
                    disabled={state.submitting}
                    className="mt-1"
                    defaultSelectedKeys={''}
                    placeholder='Select a feedback type'
                >
                    <SelectItem key={'bug'} value="bug">Bug Report</SelectItem>
                    <SelectItem key={'feature'} value="feature">Feature Request</SelectItem>
                    <SelectItem key={'question'} value="question">Question</SelectItem>
                    <SelectItem key={'comment'} value="comment">General Comment</SelectItem>
                </Select>
                <ValidationError prefix="Feedback Type" field="feedbackType" errors={state.errors} />
            </div>

            <div className="flex flex-col">
                <label htmlFor="rating" className="text-gray-700 dark:text-gray-300">Rating (1-5)</label>
                <Input
                    id="rating"
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    fullWidth
                    required
                    isRequired
                    aria-label='rating'
                    disabled={state.submitting}
                    className="mt-1"
                    placeholder='Please enter a rating between 1 and 5'
                />
                <ValidationError prefix="Rating" field="rating" errors={state.errors} />
            </div>

            <div className="flex flex-col">
                <label htmlFor="feedback" className="text-gray-700 dark:text-gray-300">Additional Comments</label>
                <Textarea
                    id="feedback"
                    name="feedback"
                    fullWidth
                    required
                    isRequired
                    aria-label='feedback'
                    disabled={state.submitting}
                    rows={5}
                    className="mt-1"
                    placeholder='Please enter any additional comments'
                />
                <ValidationError prefix="Feedback" field="feedback" errors={state.errors} />
            </div>

            <Button
                type="submit"
                disabled={state.submitting}
                color="success"
                aria-label='submit'
                className="text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
                {state.submitting ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
    );
};

const FeedbackPage = () => {
    const { isLoading, authenticated, user } = useUserData();

    if (isLoading) {
        return <Loading />;
    }

    if (!authenticated) {
        return null;
    }

    return (
        <ProfileProvider>
            <ThemeProviderWithAttribute>
                <div className="h-screen flex">
                    <Sidebar />
                    <div className="container px-4 py-8 sm:ml-10 md:ml-16 lg:ml-20 overflow-y-auto w-full">
                        <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">Feedback</h1>
                        <Divider className="my-4" />
                        <div className="shadow-md rounded-md p-6">
                            <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}>
                                <FeedbackForm email={user?.email || ''} />
                            </GoogleReCaptchaProvider>
                        </div>
                        <div className="mt-4 flex justify-center items-center">
                            <div className='flex flex-col'>
                                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Have any questions?</p>
                                <div className="flex flex-row items-center justify-center">
                                    <Link href='/help' className='text-emerald-500 underline hover:text-emerald-700 mt-2 mr-1'>Help Center</Link>
                                    <span className="text-gray-500 dark:text-gray-400 mt-2">•</span>
                                    <Link href='/contact' className='text-emerald-500 underline hover:text-emerald-700 mt-2 ml-1'>Contact</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeProviderWithAttribute>
        </ProfileProvider>
    );
};

export default FeedbackPage;
