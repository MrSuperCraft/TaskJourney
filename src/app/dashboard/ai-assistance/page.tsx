import React from 'react';
import AiChatPage from '@/app/dashboard/ai-assistance/AiChatPage';
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'AI Chat',
    description: 'Chat with our friendly AI Chatbot. Ask questions, get tips, advice and more. Have conversations with our AI - integrated system chatbot to improve your task management and productivity.',

};



export default function Page() {
    return (
        <AiChatPage />
    )
}