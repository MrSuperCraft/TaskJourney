import React, { useState } from 'react';
import { Input, Divider } from '@nextui-org/react';
import { FaSearch } from 'react-icons/fa';
import { today, getLocalTimeZone, CalendarDate, parseDate } from "@internationalized/date";
const chrono = require('chrono-node');

interface DateSearcherProps {
    dueDate: CalendarDate | null;
    setDueDate: (date: CalendarDate | null) => void;
}

const DateSearcher: React.FC<DateSearcherProps> = ({ dueDate, setDueDate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [parsedDate, setParsedDate] = useState<CalendarDate | null>(null);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const results = chrono.parseDate(query);
        if (results) {
            const parsedDate = new Date(results);
            if (!isNaN(parsedDate.getTime())) { // Check if the parsed date is valid
                const parsed = parseDate(parsedDate.toISOString().split('T')[0]); // Convert JS Date to CalendarDate
                setParsedDate(parsed);
                setDueDate(parsed);
            } else {
                setParsedDate(null);
                setDueDate(null);
            }
        } else {
            setParsedDate(null);
            setDueDate(null);
        }
    };


    return (
        <div className="date-searcher mb-3">
            <Input
                className=""
                aria-label="Type a due date for the task"
                placeholder="Type a due date for your task"
                spellCheck="false"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                startContent={
                    <div className='flex flex-row items-center justify-center'>
                        <FaSearch />
                        <Divider className='bg-black'
                            style={{ height: '1.5rem', marginInline: '0.3rem' }} // Custom style for the divider
                            orientation='vertical' />
                    </div>}
            />
        </div>
    );
};

export default DateSearcher;
