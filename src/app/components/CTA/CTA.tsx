// src/components/CTASection.tsx

import React from 'react';
import { Image, Button, Card } from '@nextui-org/react';

const CTASection = () => {
    return (
        <div className="bg-gradient-to-br from-cyan-400 to-cyan-800 min-h-screen flex items-center justify-center dark:from-gray-600 dark:to-slate-900">
            <Card className="flex flex-col items-center shadow-lg">
                <div className="relative">
                    <Image src="/completed-1.svg" alt="Image" width={500} height={500} radius="md" className="object-cover object-center" />
                </div>
                <div className="p-6 text-center text-black dark:text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Ready to <span className="font-bold dark:text-cyan text-cyan-300">Get Started?</span></h1>
                    <p className="text-lg md:text-xl mb-8">Join TaskJourney today and <span className="font-bold dark:text-cyan text-cyan-300">start your path</span> to productivity and achievement.</p>
                    <div className="flex justify-center space-x-4">
                        <Button variant="shadow" className="bg-dark-cyan text-white">Get Started</Button>
                        <Button color="default" variant="shadow" className="dark:text-white text-black">Learn More</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CTASection;
