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
        <div className="mt-4 text-center">
            <span className="text-gray-600 dark:text-gray-300">
                By using this website, you are accepting our <Link href="/terms-of-service"><span className="text-teal dark:text-primary-brand-600 hover:underline ml-2">Terms of Service</span></Link> and <Link href="/privacy-policy"><span className="text-teal dark:text-primary-brand-600 hover:underline ml-2">Privacy Policy</span></Link>.
            </span>
        </div>
    </div>
);

export default Footer;
