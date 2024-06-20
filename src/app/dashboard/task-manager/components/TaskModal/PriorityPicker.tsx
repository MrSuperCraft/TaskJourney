import React from 'react';

const PriorityPicker = ({ onPriorityChange }: any) => {
    const handleChange = (event: any) => {
        onPriorityChange(event.target.value);
    };

    return (
        <div className="priority-picker-container">
            <select onChange={handleChange} className="priority-select">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
    );
};

export default PriorityPicker;
