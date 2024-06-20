import React from 'react';
import { Calendar } from '@nextui-org/react';
import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date'

interface DatePickerProps {
    onDateChange: (date: Date) => void;
    dueDate: Date | null;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, dueDate }) => {
    const handleChange = (date: CalendarDate) => {
        onDateChange(new Date(date.day, date.month - 1, date.year));
    };

    // Format the date for display in a way that accepts DateValue
    const formattedDateString = dueDate ? dueDate.toISOString().split('T')[0] : undefined;

    return (
        <div className="date-picker-container">
            <Calendar
                className='text-black'
                minValue={today(getLocalTimeZone())}
                defaultValue={today(getLocalTimeZone())}
                classNames={{
                    nextButton: "bg-black text-white shadow-lg hover:bg-gray-800",
                    prevButton: "bg-black text-white shadow-lg hover:bg-gray-800",
                    cellButton: "w-8 h-8 flex items-center justify-center rounded-full",
                }}
            />
        </div>
    );
};

export default DatePicker;


