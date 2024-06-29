import React, { useState } from 'react';
import Image from 'next/image';
import { Card, Input, Button, CardBody, Avatar, Spacer } from '@nextui-org/react';

const messages = [
    { icon: '🎁', text: 'Fun fact about the Roman Empire' },
    { icon: '💡', text: 'Morning routine for productivity' },
    { icon: '✉️', text: 'Text inviting neighbors to barbecue' },
    { icon: '🎓', text: 'Explain nostalgia to a kindergartener' },
];

const AiChat: React.FC = () => {
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            setChatMessages([...chatMessages, inputValue]);
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 font-sans">
            {/* Logo Section */}
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Image src="/android-chrome-192x192.png" width={192} height={192} alt="Logo" className="w-12 h-12" />
                </div>
                <Spacer y={1} />
                <h1 className="text-3xl font-bold mb-1 mt-2">Hi, I'm TaskBot!</h1>
                <h1 className="text-3xl font-bold mb-2">How can I help you?</h1>
                <h1 className='font-bold text-2xl mb-2'>*Not functional at the moment*</h1>
            </div>

            {/* Messages Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {messages.map((message, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="text-2xl mb-2">{message.icon}</div>
                        <div className="text-center">{message.text}</div>
                    </div>
                ))}
            </div>

            {/* Chat Box Section */}
            <div className="fixed bottom-0 left-0 w-full p-4">
                <div className="max-w-lg mx-auto">
                    <Card>
                        <CardBody>
                            <div className="flex items-center mb-4">
                                <label htmlFor="upload-file" className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-6 h-6 cursor-pointer mr-2">
                                    📎
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Message TaskBot"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    fullWidth
                                    variant='bordered'
                                    isClearable
                                />
                                <Button variant='solid' onPress={handleSendMessage}>
                                    📨
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                TaskBot can make mistakes. Check important info before chatting.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Chat Messages Display */}
            <div className="fixed bottom-16 left-0 w-full p-4 max-w-lg mx-auto" hidden>
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className="flex justify-end mb-2">
                            <Card>
                                <CardBody>
                                    <p>{msg}</p>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AiChat;
