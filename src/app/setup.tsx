import dynamic from 'next/dynamic'; // Import dynamic for lazy loading

import React from 'react'
const Navbar = dynamic(() => import('../app/components/Navbar/Navbar'));
const Footer = dynamic(() => import('../app/components/Footer/Footer'));
const FAQ = dynamic(() => import('../app/components/FAQ/FAQ'));
const Hero = dynamic(() => import('../app/components/Hero/Hero')); // Lazy load Hero component
const Features = dynamic(() => import('../app/components/Features/Features')); // Lazy load Features component
const StatBoxes = dynamic(() => import('../app/components/StatBoxes/StatBoxes')); // Lazy load StatBoxes component
const Introduction = dynamic(() => import('../app/components/Introduction/Introduction')); // Lazy load Introduction component
const CTA = dynamic(() => import('../app/components/CTA/CTA')); // Lazy load CTA component
const setup = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Introduction />
            <Features />
            <StatBoxes />
            <CTA />
            <FAQ />
            <Footer />
        </>
    )
}

export default setup