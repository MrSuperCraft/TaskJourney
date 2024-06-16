import React from 'react';
import { FaCalendar, FaSun, FaCouch, FaDoorOpen } from 'react-icons/fa';
import { CalendarDate, parseDate } from "@internationalized/date";

interface DSBProps {
    setSelectedDueDate: (date: CalendarDate | null) => void;
    selectedDueDate: CalendarDate | null;
    setDueDate: (date: Date | null) => void; // Change type to Date
    dueDate: Date | null; // Change type to Date
}

const DateSelectionButtons: React.FC<DSBProps> = ({ setSelectedDueDate, selectedDueDate, setDueDate, dueDate }) => {

    const handleDateSelection = (dateOffset: number) => {
        const today = new Date(); // Get today's date
        const newDate = new Date(today.setDate(today.getDate() + dateOffset)); // Calculate the target date based on the offset

        // Use parseDate to convert the JS Date to CalendarDate
        const parsedDate = parseDate(newDate.toISOString().split('T')[0]);

        setSelectedDueDate(parsedDate);

        // Update dueDate with targetDate
        setDueDate(newDate);

        // Log information
        console.log('Selected Date:', newDate.toISOString()); // Log the ISO string format of the date
        console.log('Selected Due Date (CalendarDate):', parsedDate); // Log the parsed CalendarDate object
        console.log('Selected Due Date (Date):', newDate.toISOString()); // Log the ISO string format of the date
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, dateOffset: number) => {
        if (event.key === 'Enter') {
            handleDateSelection(dateOffset); // Pass null as targetDate
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            const buttons = document.querySelectorAll<HTMLButtonElement>('.date-selection-button');
            const index = Array.from(buttons).indexOf(event.currentTarget);
            const newIndex = event.key === 'ArrowUp' ? Math.max(0, index - 1) : Math.min(buttons.length - 1, index + 1);
            buttons[newIndex].focus();
        }
    };

    return (
        <>
            {/* Today Button */}
            <button
                className="flex flex-row w-full hover:bg-gray-200 rounded-lg p-2 font-bold dark:hover:bg-slate-600 date-selection-button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                onClick={() => handleDateSelection(0)}
            >
                <FaCalendar className="ml-5 text-xl text-emerald-500 mr-4" /> Today
                <span className="ml-auto text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </button>

            {/* Tomorrow Button */}
            <button
                className="flex flex-row w-full hover:bg-gray-200 rounded-lg p-2 font-bold dark:hover:bg-slate-600 date-selection-button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 1)}
                onClick={() => handleDateSelection(1)}
            >
                <FaSun className="ml-5 text-xl text-yellow-400 mr-4" /> Tomorrow
                <span className="ml-auto text-sm font-medium">{new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </button>

            {/* This Weekend Button */}
            <button
                className="flex flex-row w-full hover:bg-gray-200 rounded-lg p-2 font-bold dark:hover:bg-slate-600 date-selection-button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 5 - new Date().getDay())}
                onClick={() => handleDateSelection(5 - new Date().getDay())}
            >
                <FaCouch className="ml-5 text-xl text-purple-500 mr-4" /> This Weekend
                <span className="ml-auto text-sm font-medium">{new Date(new Date().setDate(new Date().getDate() + (5 - new Date().getDay()))).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </button>

            {/* Next Week Button */}
            <button
                className="flex flex-row w-full hover:bg-gray-200 rounded-lg p-2 font-bold dark:hover:bg-slate-600 date-selection-button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, 7)}
                onClick={() => handleDateSelection(7)}
            >
                <FaDoorOpen className="ml-5 text-xl text-blue-500 mr-4" /> Next Week
                <span className="ml-auto text-sm font-medium">{new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </button>
        </>
    );
};

export default DateSelectionButtons;
