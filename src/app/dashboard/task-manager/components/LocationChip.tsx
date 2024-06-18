import React, { useState } from 'react';
import { Chip, Popover, PopoverTrigger, PopoverContent, Input, Divider, Button } from '@nextui-org/react';
import { FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LocationChip: React.FC<{ setLocation: (location: string | null) => void, location: string | null }> = ({ location, setLocation }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [locationInput, setLocationInput] = useState('');

    const handleSaveLocation = () => {
        setLocation(locationInput);
        setIsPopoverOpen(false);
    };

    const handleCancel = () => {
        setLocation(null); // Clear the location
        setIsPopoverOpen(false); // Close the popover
    };

    const handleChipClose = () => {
        setLocation(null); // Clear the location
        setIsPopoverOpen(false); // Close the popover
    };

    return (
        <Popover
            placement="bottom-end"
            offset={-200}
            crossOffset={-100}
            onClose={() => setIsPopoverOpen(false)} // Close popover when clicking outside or pressing Esc
            showArrow={true}
            shouldBlockScroll={true}
            isOpen={isPopoverOpen}
        >
            <PopoverTrigger>
                <motion.div whileHover={{ scale: 1.1 }}>
                    <Chip
                        className="bg-primary-brand-700 dark:bg-cyan-700 text-white cursor-pointer ml-2 rounded-xl"
                        startContent={<FaMapMarkerAlt className='ml-1' />}
                        classNames={{ content: 'w-28 text-center flex justify-between items-center' }}
                        onClick={() => setIsPopoverOpen(true)}
                        onClose={handleChipClose} // Handle chip close to clear location and close popover
                        aria-haspopup="true"
                        aria-expanded={isPopoverOpen}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setIsPopoverOpen(true)}
                    >
                        {location || 'Location'}
                    </Chip>
                </motion.div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-4">
                    <Input
                        label="Task Location"
                        fullWidth
                        placeholder="Enter location"
                        size="lg"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        type='text'
                        maxLength={30}
                        aria-label="Task Location"
                    />
                    <Divider className='my-4' />
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant='flat'
                            onClick={handleCancel}
                            endContent={<FaTimes />}
                            aria-label="Cancel Location Input"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveLocation}
                            color='success'
                            endContent={<FaCheck />}
                            aria-label="Save Location Input"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default LocationChip;
