import React from 'react';
import { Calendar } from '@nextui-org/react';

const ReminderPicker = ({ onReminderChange }: any) => {
    const handleChange = (date: any) => {
        onReminderChange(date.toString());
    };

    return (
        <div className="reminder-picker-container">
            <Calendar onSelect={handleChange} />
        </div>
    );
};

export default ReminderPicker;
