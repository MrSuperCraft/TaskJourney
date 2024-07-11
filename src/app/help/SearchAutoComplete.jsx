// components/SearchAutocomplete.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@nextui-org/react';
import { FiSearch } from 'react-icons/fi';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import client from '@/app/lib/contentful';
import Link from 'next/link';
import { useDebounce } from '@/app/utils/debounce';

const SearchAutocomplete = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchResults = useCallback(async (term) => {
        if (!term || typeof term !== 'string' || term.trim().length === 0) return;
        try {
            setLoading(true);
            const response = await client.getEntries({
                content_type: 'helpPageContent',
            });

            // Filter results to include only those with titles containing the search term
            const filteredResults = response.items.filter(item =>
                item.fields.title.toLowerCase().includes(term.toLowerCase())
            );

            setResults(filteredResults);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching results:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            await fetchResults(debouncedSearchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [debouncedSearchTerm, fetchResults]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        fetchResults(value);
    };

    const handleBackspace = () => {
        if (searchTerm.trim().length === 0 && results.length > 0) {
            setResults([]);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && searchTerm.trim().length === 0 && results.length > 0) {
            event.preventDefault();
            setResults([]);
        }
    };

    return (
        <div className="relative w-full max-w-2xl">
            <Input
                isClearable
                onClear={() => setSearchTerm('')}
                placeholder="Search..."
                startContent={<FiSearch className='w-6 h-6' />}
                className="rounded-xl shadow-sm w-full text-lg transition-all duration-300 hover:shadow-lg hover:border-blue-500 focus:border focus:border-blue-500 focus:ring-0 focus:shadow-lg"
                size="lg"
                classNames={{
                    base: "h-16",
                    inputWrapper: "h-16"
                }}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}

            />
            {loading && <Spinner className="absolute z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" color="primary" />}
            {searchTerm.length > 0 && results.length > 0 && (
                <ul className="absolute z-50 w-full bg-white dark:bg-gray-800 shadow-lg mt-2 rounded-xl overflow-hidden">
                    {results.map((result) => (
                        <li key={result.sys.id} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Link href={`/help/${result.fields.slug}`}>
                                <p className="text-gray-800 dark:text-gray-100">{result.fields.title}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchAutocomplete;
