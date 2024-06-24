import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa';

const AddTaskButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            style={{
                backgroundColor: '#1abc9c',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            className='mb-10'
            startContent={<FaPlus />}
            variant="shadow"
        >
            Add Task
        </Button>
    );
};

export default AddTaskButton;
