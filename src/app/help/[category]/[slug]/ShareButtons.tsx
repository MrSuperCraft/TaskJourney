'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { Button } from '@nextui-org/react';

const ShareButtons = () => {
    const path = usePathname();
    const url = process.env.NEXT_PUBLIC_BASE_URL + path;

    return (
        <div className="flex space-x-0 md:space-x-4 space-y-4 md:space-y-0 mt-10 text-white flex-col md:flex-row">
            <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
            >
                <Button variant='shadow' endContent={<FaFacebook className="text-lg" />} color="primary" >
                    Share on Facebook
                </Button>
            </Link>
            <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
            >
                <Button variant='shadow' endContent={<FaTwitter className="text-lg" />} color="secondary" >
                    Share on Twitter
                </Button>
            </Link>
            <Link
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
            >
                <Button variant='shadow' endContent={<FaLinkedin className="text-lg" />} color="success" className='text-white' >
                    Share on LinkedIn
                </Button>
            </Link>
        </div>
    );
};

export default ShareButtons;
