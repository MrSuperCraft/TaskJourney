// src/components/CTASection.tsx

import React from 'react';
import { Image, Button, Card } from '@nextui-org/react';

const CTASection = () => {
    return (
        <div className="bg-gradient-to-br from-cyan-400 to-cyan-800 min-h-screen flex items-center justify-center dark:from-gray-600 dark:to-slate-900 px-4">
            <Card className="flex flex-col items-center shadow-lg max-w-lg md:max-w-2xl lg:max-w-4xl w-full">
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
                        <Image
                            src="/completed-1.svg"
                            alt="Image"
                            width={500}
                            height={500}
                            radius="md"
                            className="object-cover object-center w-full h-auto"
                        />
                    </div>
                </div>
                <div className="p-6 text-center text-black dark:text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to <span className="font-bold dark:text-cyan text-cyan-400">Get Started</span>?
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Join TaskJourney today and <span className="font-bold dark:text-cyan text-cyan-400"><br />begin your journey</span> to productivity and achievement.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                        <Button variant="shadow" className="bg-dark-cyan text-white w-full md:w-auto">
                            Get Started
                        </Button>
                        <Button color="default" variant="shadow" className="dark:text-white text-black w-full md:w-auto">
                            Learn More
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CTASection;
