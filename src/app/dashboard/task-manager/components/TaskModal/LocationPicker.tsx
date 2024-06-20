import React, { useState } from 'react';

const LocationPicker = ({ onLocationChange }: any) => {
    const [location, setLocation] = useState('');

    const handleChange = (event: any) => {
        setLocation(event.target.value);
        onLocationChange(event.target.value);
    };

    return (
        <div className="location-picker-container">
            <input
                type="text"
                value={location}
                onChange={handleChange}
                placeholder="Enter location"
                className="location-input"
            />
        </div>
    );
};

export default LocationPicker;
