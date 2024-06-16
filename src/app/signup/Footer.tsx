import React from 'react';
import Link from 'next/link';

const Footer = () => (
    <div className="mt-4 text-center">
        <span className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/login">
                <span className="text-teal dark:text-primary-brand-light hover:underline">
                    Log in here
                </span>
            </Link>
        </span>
    </div>
);

export default Footer;
