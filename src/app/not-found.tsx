// components/NotFound.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggleButton from '../app/components/ThemeToggleButton';
import { ThemeProviderWithAttribute } from '../app/contexts/ThemeContext';
import { FaHome } from 'react-icons/fa';
import { FiHelpCircle } from 'react-icons/fi';
const NotFound: React.FC = () => {
    return (
        <ThemeProviderWithAttribute>
            <div className="flex flex-col h-screen md:flex-row bg-gradient-to-br from-[#F2F2F2] via-[#D3D3D3] to-[#737373] dark:from-[#1F1F1F] dark:via-[#3D3D3D] dark:to-[#6B6B6B]">
                <div className="flex flex-col justify-center items-center text-center p-5 md:w-1/2">
                    <div className="mb-5">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold">4 0 4</h1>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black">
                            Well, <u>that&apos;s odd.</u>
                        </h2>
                        <p className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl my-2 font-medium">How did we get here?</p>
                        <p className="text-xl md:text-2xl lg:text-3xl mt-10 md:mt-32 font-medium">
                            Let&apos;s take you back to somewhere familiar.
                        </p>
                        <div className="flex gap-3 mt-5 items-center justify-center">
                            <Link href="/">
                                <div className="bg-black dark:bg-gray-300 text-xl text-white dark:text-black w-32 md:w-44 h-11 rounded-3xl hover:bg-gray-700 dark:hover:bg-gray-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex text-center justify-center items-center">
                                    <FaHome className='mr-2 hidden md:block' /> Home
                                </div>
                            </Link>
                            <Link href="/help">
                                <div className="bg-[#EDEDED] dark:bg-[#555555] text-xl text-black dark:text-white w-32 md:w-44 h-11 rounded-3xl hover:bg-gray-300 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer flex text-center justify-center items-center">
                                    <FiHelpCircle className='mr-2 hidden md:block' /> Help Center
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-20">
                        <ThemeToggleButton />
                    </div>
                </div>
                <div className="flex justify-center items-end w-full md:w-1/2">
                    <div className="w-full max-w-xl">
                        <Image src="/stairs.svg" alt="Stairs" layout="responsive" width={800} height={1500} />
                    </div>
                </div>
            </div>
        </ThemeProviderWithAttribute>
    );
};

export default NotFound;
