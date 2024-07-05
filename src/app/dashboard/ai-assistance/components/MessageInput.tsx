import React, { useState } from 'react';
import { Textarea, Button } from '@nextui-org/react';
import { FaClipboard, FaMailBulk } from 'react-icons/fa';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="flex static bottom-0 z-20 items-center mb-4">
            <label htmlFor="upload-file" className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-6 h-6 cursor-pointer mr-2">
                <FaClipboard />
            </label>
            <Textarea
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
            />
            <Button variant='solid' onPress={handleSendMessage}>
                <FaMailBulk />
            </Button>
        </div>
    );
};

export default MessageInput;
