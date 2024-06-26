
import React from 'react'
import SignupPage from "./SignUpPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Sign up with TaskJourney to access your dashboard.',
    robots: {
        index: true,
        follow: true,
    },
}



const page = () => {
    return (
        <SignupPage />
    )
}

export default page