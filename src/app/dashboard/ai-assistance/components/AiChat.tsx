import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody, Spacer } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { generateAI } from '@/app/firebase';
import MessageInput from './MessageInput';
import ChatMessage from './ChatMessage';
import { toast, ToastContainer } from "react-toastify";

const messages = [
    { icon: '📈', text: 'Tell me 3 tips to increase motivation' },
    { icon: '💡', text: 'Morning routine for productivity' },
    { icon: '🌠', text: 'Help me set my goals the right way' },
    { icon: '🎓', text: 'Teach me a new strategy to better my organizing skills' },
];

interface ChatMessageData {
    message: string;
    isFromAI: boolean;
}

const AiChat: React.FC = () => {
    const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);

    const handleSendMessage = async (message: string): Promise<void> => {
        setChatMessages((prevMessages) => [...prevMessages, { message, isFromAI: false }]);

        // Generate response using Gemini
        const response = await generateAI(message);
        setChatMessages((prevMessages) => [...prevMessages, { message: response as string, isFromAI: true }]);
    };

    const handleCopyMessage = (message: string) => {
        navigator.clipboard.writeText(message);
        toast.success('Message copied to clipboard!');
    };

    const handleRegenerateMessage = async (message: string) => {
        const response = await generateAI(message);
        setChatMessages((prevMessages) => [...prevMessages, { message: response as string, isFromAI: true }]);
    };

    const handleRateMessage = (message: string, rating: number) => {
        console.log(`Rated message: "${message}" with ${rating} star(s)`);
        // Implement rating functionality as needed
    };

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 font-sans">
                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image src="/android-chrome-192x192.png" width={192} height={192} alt="Logo" className="w-12 h-12" />
                    </div>
                    <Spacer y={1} />
                    <h1 className="text-3xl font-bold mb-1 mt-2">Hi, I&apos;m TaskBot!</h1>
                    <h1 className="text-3xl font-bold mb-2">How can I help you?</h1>
                    <h1 className='font-bold text-2xl mb-2'>*Not functional at the moment*</h1>
                </div>

                {/* Messages Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-2xl mb-2">{message.icon}</div>
                            <div className="text-center">{message.text}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Chat Messages Display */}
                <div className="w-full max-w-lg mb-16">
                    {chatMessages.map((chatMessage, index) => (
                        <ChatMessage
                            key={index}
                            message={chatMessage.message}
                            isFromAI={chatMessage.isFromAI}
                            onCopyMessage={handleCopyMessage}
                            onRegenerateMessage={handleRegenerateMessage}
                            onRateMessage={handleRateMessage}
                        />
                    ))}
                </div>

                {/* Chat Box Section */}
                <div className="w-full p-4 bg-white">
                    <div className="max-w-lg mx-auto">
                        <Card>
                            <CardBody>
                                <MessageInput onSendMessage={handleSendMessage} />
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    TaskBot can make mistakes. Check important info before chatting.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AiChat;
