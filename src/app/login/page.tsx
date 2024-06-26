import LoginPage from "./LoginPage";
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login with TaskJourney to access your dashboard.',
    robots: {
        index: true,
        follow: true,
    },
}

const Page = () => {
    return (
        <LoginPage />
    )
}

export default Page