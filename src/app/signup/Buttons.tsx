import React from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { FaGoogle } from 'react-icons/fa';

interface DataHandleInterface {
    handleGoogleSignup: () => void;
    isLoading: boolean; // Add loading state prop
    error: string | null; // Error message
}

const Buttons: React.FC<DataHandleInterface> = ({ handleGoogleSignup, isLoading, error }) => (
    <>
        {error && <p className="text-red-500 text-left mb-4 text-lg">{error}</p>}

        <div className="mt-4 flex items-center justify-center">
            <hr className="border-t border-gray-400 w-1/4 mr-4" />
            <span className="text-black dark:text-gray-300 font-lato">or</span>
            <hr className="border-t border-gray-400 w-1/4 ml-4" />
        </div>
        <div className="mt-4 flex justify-center items-center">
            <Button color="default" variant="bordered" className="flex items-center space-x-2" onClick={handleGoogleSignup} disabled={isLoading}>
                {isLoading ? <Spinner color="default" /> : <FaGoogle />}
                <span>Sign up with Google</span>
            </Button>
        </div>
    </>
);

export default Buttons;
