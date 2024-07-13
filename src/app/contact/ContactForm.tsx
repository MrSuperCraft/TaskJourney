// components/ContactForm.tsx

'use client';

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_SECRET as string, {
        data: { "g-recaptcha-response": executeRecaptcha }
    });

    if (state.succeeded) {
        return (
            <div className="flex items-center justify-center mt-32 text-center mx-auto mb-32">
                <div className="text-center text-gray-900 dark:text-gray-100 mt-4">
                    <FaCheckCircle className="text-6xl text-green-500 mb-4 mx-auto" />
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                        Thanks for contacting us!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        We greatly appreciate you reaching out. Sit tight, we&apos;ll get back to you shortly!
                    </p>
                    <div className="mt-6">
                        <Link href="/login">
                            <Button color='success' className='border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold' variant="bordered">
                                Start getting productive today
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto my-auto">
            <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    fullWidth
                    required
                    aria-label='email'
                    className="mt-1"
                    placeholder='Please enter your email address'
                    disabled={state.submitting}
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name &#40;optional&#41;
                </label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    fullWidth
                    aria-label='name'
                    className="mt-1"
                    placeholder='Please enter your name'
                    disabled={state.submitting}
                />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
            </div>

            <div className="flex flex-col">
                <label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Subject</label>
                <Input
                    id="subject"
                    type="text"
                    name="subject"
                    fullWidth
                    required
                    isRequired
                    aria-label='subject'
                    className="mt-1"
                    placeholder='Please enter the subject'
                    disabled={state.submitting}
                />
                <ValidationError prefix="Subject" field="subject" errors={state.errors} />
            </div>

            <div className="flex flex-col">
                <label htmlFor="message" className="text-gray-700 dark:text-gray-300">Message</label>
                <Textarea
                    id="message"
                    name="message"
                    fullWidth
                    required
                    isRequired
                    aria-label='message'
                    rows={5}
                    className="mt-1"
                    placeholder='Please enter your message'
                    disabled={state.submitting}
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
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

export default ContactForm;
