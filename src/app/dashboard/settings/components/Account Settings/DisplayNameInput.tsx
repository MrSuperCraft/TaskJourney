import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/react';

interface DisplayNameProps {
    userData: {
        username?: string;
    };
    handleInputChange: (key: string, value: string) => void;
    usernameError: string | null;
}

const DisplayNameInput: React.FC<DisplayNameProps> = ({ userData, handleInputChange, usernameError }) => {
    const charLimit = 20;
    const [charCount, setCharCount] = useState(userData.username ? userData.username.length : 0);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        setCharCount(userData.username ? userData.username.length : 0);
    }, [userData.username]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= charLimit) {
            handleInputChange('username', value);
            setWarning('');
        } else {
            setWarning(`Character limit exceeded.`);
        }
        setCharCount(value.length);
    };

    return (
        <div className="flex flex-col">
            <span className="text-lg mb-2">Display Name</span>
            <Input
                maxLength={charLimit}
                type="text"
                className="border rounded-xl"
                value={userData.username || ''}
                onChange={handleInput}
                endContent={
                    <p className={`text-sm ${charCount > charLimit ? 'text-red-500' : ''}`}>
                        {charCount}/{charLimit}
                    </p>}
            />
            <div className="flex justify-between mt-2">
                {usernameError && <p className="text-red-500">{usernameError}</p>}
            </div>
            {warning && <p className="text-red-500 mt-2">{warning}</p>}
        </div>
    );
};

export default DisplayNameInput;
