'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Heading {
    id: string;
    text: string;
}

interface TableOfContentsProps {
    headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
    const [activeId, setActiveId] = useState<string>('');
    const navbarHeight = 100; // Adjust this value to match your navbar height

    useEffect(() => {
        const handleScroll = () => {
            const offsets = headings.map(heading => {
                const element = document.getElementById(heading.id);
                return {
                    id: heading.id,
                    offsetTop: element?.offsetTop || 0,
                };
            });

            const scrollPosition = window.scrollY + window.innerHeight / 3;

            const activeHeading = offsets.reduce((closest, current) => {
                if (current.offsetTop < scrollPosition) {
                    return current;
                }
                return closest;
            }, { id: '', offsetTop: 0 });

            setActiveId(activeHeading.id);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [headings]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -navbarHeight;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="sticky top-40 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 max-w-xs">
            {headings.map((heading, index) => (
                <div key={index} className={`py-3 border-l-4 border-spacing-3 ${activeId === heading.id ? 'border-blue-500' : 'border-transparent'}`}>
                    <Link href={`#${heading.id}`} className={`text-gray-700 dark:text-gray-300 ${activeId === heading.id ? 'font-bold text-blue-500' : ''}`} onClick={(e) => handleLinkClick(e, heading.id)}>
                        {heading.text}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TableOfContents;
