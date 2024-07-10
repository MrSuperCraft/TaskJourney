'use client';

import React, { useState } from 'react';
import { FaHashtag } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { FaCheck } from 'react-icons/fa6';


const ClientAnchor = ({ id }) => {
    const [copied, setCopied] = useState(false);

    const pathname = usePathname();
    const url = process.env.NEXT_PUBLIC_BASE_URL + pathname;

    const handleCopyLink = () => {
        const url = `${window.location.origin}${pathname}#${id}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div id={`#${id}`} key={id} onClick={handleCopyLink}>
            {copied ? <p className=" transition-opacity duration-300 ml-2"> <FaCheck /> </p> : (
                <p className="group relative transition-opacity duration-300 ml-2">
                    <FaHashtag className="text-gray-500 opacity-0 hover:opacity-100 transition-all duration-300" />
                </p>
            )}
        </div>
    )
};

export default ClientAnchor;

