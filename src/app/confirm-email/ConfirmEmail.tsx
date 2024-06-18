'use client';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, Spacer, Button } from '@nextui-org/react';

const ConfirmEmailComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        // Redirect to home if email is not provided
        if (!email) {
            router.push('/');
        }
    }, [email, router]);

    if (!email) {
        return <p>Loading...</p>; // Show loading state while email is being checked
    }

    return (
        <Card className="flex items-center justify-center h-screen bg-sky-blue dark:bg-slate-800">
            <Card className=" p-6 shadow-lg w-[400px] dark:bg-dark-primary-brand">
                <CardBody className="text-center text-dark-primary-brand dark:text-light-cyan font-bold font-inter text-xl underline">
                    Confirm your email
                </CardBody>
                <Spacer y={1} />
                <CardBody className="text-center text-teal dark:text-black font-lato text-xl">
                    We have sent a verification email to <strong>{decodeURIComponent(email)}</strong>
                    Please check your inbox and follow the instructions to complete your account setup.
                </CardBody>
                <Link href="/login">
                    <Button className="text-white bg-dark-primary-brand dark:bg-dark-navy-blue mx-auto flex align-center items-center" >Sign In</Button>
                </Link>
            </Card>
        </Card>
    );
};

const ConfirmEmail = dynamic(() => Promise.resolve(ConfirmEmailComponent), { ssr: false });

export default ConfirmEmail;
