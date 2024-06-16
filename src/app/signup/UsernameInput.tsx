import React, { Fragment } from 'react';
import { Input } from '@nextui-org/react';
import { FaCheckCircle } from 'react-icons/fa';

interface UsernameInputInterface {
    username: string;
    setUsername: (username: string) => void;
    usernameAvailable: boolean | null;
    suggestions: string[];
}


const UsernameInput: React.FC<UsernameInputInterface> = ({
    username,
    setUsername,
    usernameAvailable,
    suggestions,
}) => (
    <>
        <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`border rounded-xl mb-0 ${username.length === 0 ? '' : usernameAvailable === null ? '' : usernameAvailable ? 'border-green-500' : 'border-red-500'}`}
        />
        {usernameAvailable && (
            <div className="text-green-600 mb-4 flex items-center text-left -mt-4">
                Your username is valid
                <FaCheckCircle className="ml-2" />
            </div>

        )}
        {usernameAvailable === false && suggestions.length > 0 && (
            <div className="text-red-500 text-md text-left">
                Username is taken. Suggestions:
                <ul className="flex flex-row">
                    {suggestions.map((suggestion: string, index: number) => (
                        <Fragment key={suggestion}>
                            <li className="cursor-pointer hover:underline text-dark-primary-brand" onClick={() => setUsername(suggestion)}>
                                {suggestion}
                            </li>
                            {index < suggestions.length - 1 && <div className="text-xl mx-2 text-black">·</div>}
                        </Fragment>
                    ))}
                </ul>
            </div>
        )}
    </>
);

export default UsernameInput;
