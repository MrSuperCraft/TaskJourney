/* import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from "react-icons/fa6";
import { useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase'; // Adjust the import according to your project structure

import PasswordStrengthBar from 'react-password-strength-bar';
import '../globals.css'

interface DataInterface {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
}

const EmailAndPasswordInputs: React.FC<DataInterface> = ({
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
}) => {
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const validateEmail = async (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email format

        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            return;
        }

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setEmailError('Email already in use');
            } else {
                setEmailError(null);
            }
        } catch (error: any) {
            if (error.code === 'auth/quota-exceeded') {
                setEmailError('Quota exceeded, try again later');
            } else if (error.code === 'auth/network-request-failed') {
                setEmailError('Server error, try again later');
            } else {
                setEmailError('Invalid email');
            }
        }
    };



    const debouncedValidateEmail = useCallback(debounce(validateEmail, 1500), []);


    const handlePasswordChange = (value: string) => {
        setPassword(value);
        validatePassword(value);
    };

    const validatePassword = (password: string) => {
        const regex = {
            lower: /[a-z]/,
            upper: /[A-Z]/,
            digit: /\d/,
            special: /[!@#$%^&*(),.?":{}|<>]/,
            length: /.{8,80}/
        };

        const conditions = [
            { label: 'one lowercase letter', regex: regex.lower },
            { label: 'one uppercase letter', regex: regex.upper },
            { label: 'one digit', regex: regex.digit },
            { label: 'one special character', regex: regex.special },
            { label: '8-80 characters long', regex: regex.length }
        ];

        let errors: string[] = [];
        conditions.forEach((condition) => {
            if (!condition.regex.test(password)) {
                errors.push('- ' + condition.label);
            }
        });

        if (password.length === 0) {
            setPasswordError(null);
        } else if (errors.length > 0) {
            setValidationErrors(errors);
            setPasswordError('Password does not meet the following criteria:');
        } else {
            setValidationErrors([]);
            setPasswordError(null);
        }
    };



    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <>
            <div className="input-container">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        debouncedValidateEmail(e.target.value);
                    }}
                    color='default'
                    className={`border rounded-xl ${email.length === 0 ? '' : !emailError ? 'border-green-500' : 'border-red-500'}`}
                />
                {!emailError && email.length > 0 && (
                    <div className="text-green-600 mb-4 mt-2 flex items-center text-left">
                        Your Email is valid
                        <FaCheckCircle className="ml-2" />
                    </div>
                )}
                {emailError && email.length > 0 && (
                    <div className="text-red-600 mb-4 mt-2 flex items-center text-left">
                        {emailError}
                        <FaCircleXmark className="ml-2" />
                    </div>
                )}
            </div>

            <div className="input-container">
                <div className="password-input-container">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        color='default'
                        className={`border rounded-xl ${passwordError
                            ? 'border-red-500'
                            : password && password.length > 0
                                ? 'border-green-500'
                                : ''
                            }`}
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password-btn">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {passwordError && (
                    <div className="error-text">
                        {passwordError}
                        <ul>
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {password && password.length > 0 && validationErrors.length === 0 && (
                    <div className="text-green-600 mb-4 mt-0 flex items-center text-left">
                        Your password is valid
                        <FaCheckCircle className="ml-2" />
                    </div>
                )}
                {password && password.length > 0 && (
                    <div className="password-strength">
                        <PasswordStrengthBar password={password} />
                    </div>
                )}
            </div>
            <div className="input-container">
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    color='default'
                    className={`border rounded-xl ${confirmPassword && confirmPassword.length > 0
                        ? password !== confirmPassword
                            ? 'border-red-500'
                            : 'border-green-500'
                        : ''
                        }`}
                />
                {password !== confirmPassword && confirmPassword && (
                    <p className="error-text">Passwords do not match</p>
                )}
            </div>
        </>
    );
};

export default EmailAndPasswordInputs;
*/