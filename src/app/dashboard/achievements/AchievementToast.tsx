import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

interface AchievementToastProps {
    message: string;
    imgSrc?: string;
    onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ message, imgSrc, onClose }) => (
    <div className="flex items-center p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <div className="flex-shrink-0">
            {imgSrc && <Image className="w-12 h-12 rounded-full" width={48} height={48} src={imgSrc} alt="Achievement Icon" />}
        </div>
        <div className="ml-4">
            <p className="text-lg font-semibold">{message}</p>
        </div>
        <Button
            onClick={onClose}
            className="ml-4 bg-blue-500 text-white rounded-full p-2 focus:outline-none"
        >
            Close
        </Button>
    </div>
);

export default AchievementToast;