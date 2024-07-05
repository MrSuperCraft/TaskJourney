import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { FaCopy } from 'react-icons/fa';
import { FaRepeat } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    message: string;
    isFromAI: boolean;
    onCopyMessage: (message: string) => void;
    onRegenerateMessage: (message: string) => void;
    onRateMessage: (message: string, rating: number) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isFromAI, onCopyMessage, onRegenerateMessage, onRateMessage }) => {
    const handleRegenerate = () => {
        onRegenerateMessage(message);
    };

    const handleRate = (rating: number) => {
        onRateMessage(message, rating);
    };

    const handleCopy = () => {
        onCopyMessage(message);
    };

    return (
        <motion.div
            className="flex justify-end mb-2 w-full max-w-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative">
                <CardBody>
                    <article className="prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
                    </article>
                    {isFromAI && (
                        <div className="flex items-center justify-end mt-2">
                            <Button
                                className="text-sm"
                                onPress={() => handleRegenerate()}
                                variant="ghost"
                            >
                                <FaRepeat />
                            </Button>
                            <Button
                                className="ml-2 p-1 text-sm"
                                onPress={() => handleCopy()}
                                variant="ghost"
                                isIconOnly
                            >
                                <FaCopy />
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </motion.div>
    );
};

export default ChatMessage;
