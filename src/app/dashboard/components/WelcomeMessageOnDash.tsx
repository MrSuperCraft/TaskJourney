// components/WelcomeMessage.tsx
import React from 'react';

interface WelcomeMessageProps {
    name: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ name }) => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
            <p className="text-lg mt-2">Here&apos;s your personalized dashboard:</p>
        </div>
    );
};

export default WelcomeMessage;
