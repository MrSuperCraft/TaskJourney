import React, { useState } from 'react';
import { Input, Textarea, Chip, Calendar, Popover, Button, PopoverContent, PopoverTrigger, Divider, Checkbox } from '@nextui-org/react';
import { FaCalendar, FaClock, FaCouch, FaDoorOpen, FaMapMarkerAlt, FaSun, FaTimes, FaChevronDown, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { db } from '@/app/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/contexts/AuthContext';
import { Task } from '../../types';
import { today, getLocalTimeZone, DateValue, CalendarDate } from "@internationalized/date";
import DateSearcher from './DateSearcher';
import DateSelectionButtons from './DateSelectionButtons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyEditor from './TextArea/MyEditor';
import EditorProvider, { useDescription } from '@/app/contexts/EditorContext';
import LocationChip from './LocationChip';
import ReminderChip from './ReminderChip';


type Priority = 'low' | 'medium' | 'high';

interface TaskCreationBoxProps {
    onClose: () => void;
    onTaskAdd: (newTask: Task) => void;
}

const TaskCreationBox: React.FC<TaskCreationBoxProps> = ({ onClose, onTaskAdd }) => {
    const user = useAuth(); // Get the current authenticated user
    const [title, setTitle] = useState('');
    const { description, setDescription } = useDescription();
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [location, setLocation] = useState<string | null>(null); // Explicitly define type as string | null
    const [reminder, setReminder] = useState<Date | null>(null);
    const [selectedDueDate, setSelectedDueDate] = useState<CalendarDate | null>(null); // Changed to CalendarDate
    const [priority, setPriority] = useState<Priority>('medium');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [close, setClose] = useState(false);
    const [isDaily, setIsDaily] = useState(false);




    const handleSave = async () => {
        if (user) {
            // Check if title and description are not empty
            if (!title.trim()) {
                toast.error('Task title is required.', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined
                });
                return; // Exit the function if title or description is empty
            }

            try {
                const newTaskRef = await addDoc(collection(db, `users/${user.user?.uid}/tasks`), {
                    title,
                    description: description,
                    date: isDaily ? 'Refreshes Daily' : (dueDate ? new Date(dueDate).toDateString() : 'N/A'),
                    priority: priority,
                    location: location ? location : 'N/A',
                    reminder: reminder ? new Date(reminder).toUTCString() : 'No time specified',
                    createdAt: new Date(),
                    subtasks: [],
                    complete: false,
                    completedAt: null,
                    isDaily: isDaily
                });

                const newTask: Task = {
                    id: newTaskRef.id,
                    title,
                    description: description,
                    date: isDaily ? 'Refreshes Daily' : (dueDate ? new Date(dueDate).toDateString() : 'N/A'),
                    priority: priority,
                    location: location ? location : 'N/A',
                    reminder: reminder ? new Date(reminder).toUTCString() : 'No time specified',
                    createdAt: new Date(),
                    subtasks: [],
                    complete: false,
                    completedAt: null,
                    isDaily: isDaily
                };

                onTaskAdd(newTask);
                onClose();
            } catch (error) {
                console.error("Error saving task: ", error);
                toast.error('Error saving task. Please try again.', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,

                });
            }
        } else {
            console.error("User not authenticated");
            toast.error('User not authenticated. Please log in again.', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,

            });
        }
    };


    const handleDateChange = (value: DateValue) => {
        if (value) {
            const selectedDate = new Date(value.year, value.month - 1, value.day);
            const calendarDate = new CalendarDate(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate())
            setDueDate(selectedDate);
            setSelectedDueDate(calendarDate);
            setIsPopoverOpen(false); // Close the popover when a date is selected

        } else {
            setDueDate(null);
            setSelectedDueDate(null);
        }
    };


    const handleSetReminder = (reminderDate: Date | null) => {
        if (reminderDate) {
            setReminder(reminderDate);
        }

    }



    const variants = {
        visible: { opacity: 1, y: 20 },
        hidden: { opacity: 0, y: -50 },
    };


    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case 'low':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'high':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
            className="task-creation-box p-6 mt-4 bg-white dark:bg-neutral-950 shadow-lg rounded-lg mb-4"
        >
            <Input
                isRequired
                required
                label="Task Name"
                fullWidth
                placeholder="Choose a task name for display, for example 'Buy groceries'"
                size="lg"
                className="font-bold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type='text'

            />


            <MyEditor />


            <div className="flex md:items-center items-start mt-4 gap-2 flex-col md:flex-row">
                <Popover placement="bottom-end" offset={-250} crossOffset={-150}
                    onClose={() => setIsPopoverOpen(false)}
                    showArrow={true}
                    shouldBlockScroll={true}
                    isOpen={isPopoverOpen} // Control the visibility of the popover

                >
                    <PopoverTrigger>
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Chip
                                className={`bg-primary-brand-700 dark:bg-cyan-700 text-white cursor-pointer ml-2 rounded-xl`}
                                startContent={<FaCalendar className='ml-1' />}
                                classNames={{ content: 'w-28 text-center flex justify-between items-center' }}
                                onClick={() => setIsPopoverOpen(true)} // Open the popover when the trigger is clicked
                                onClose={() => { setSelectedDueDate(null); setIsPopoverOpen(false) }}


                            >
                                {selectedDueDate ? (
                                    <span className='flex justify-between items-center w-full'>
                                        {new Date(selectedDueDate.year, selectedDueDate.month - 1, selectedDueDate.day).toLocaleDateString('en-US', { timeZone: getLocalTimeZone() })}
                                    </span>
                                ) : (
                                    'Due Date'
                                )}

                            </Chip>
                        </motion.div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="p-4">
                            <div className="mt-4">
                                <DateSearcher dueDate={selectedDueDate} setDueDate={setSelectedDueDate}
                                    isPopoverOpen={isPopoverOpen} setPopoverOpen={setIsPopoverOpen}

                                />
                            </div>
                            <Divider className='mb-2' />
                            <div className="flex flex-col space-y-2 mb-4">
                                <DateSelectionButtons setSelectedDueDate={setSelectedDueDate} selectedDueDate={selectedDueDate}
                                    isPopoverOpen={isPopoverOpen} setPopoverOpen={setIsPopoverOpen}
                                    setDueDate={setDueDate} dueDate={dueDate} />
                            </div>

                            <Divider className='mb-4' />
                            <div className="mb-4">
                                <Calendar
                                    className='text-black'
                                    onChange={handleDateChange}
                                    minValue={today(getLocalTimeZone())}
                                    defaultValue={today(getLocalTimeZone())}
                                    value={selectedDueDate ? new CalendarDate(selectedDueDate.year, selectedDueDate.month, selectedDueDate.day) : today(getLocalTimeZone())} // Use a default value if selectedDueDate is null
                                    classNames={{
                                        nextButton: "bg-black text-white shadow-lg hover:bg-gray-800",
                                        prevButton: "bg-black text-white shadow-lg hover:bg-gray-800",
                                        cellButton: "w-8 h-8 flex items-center justify-center rounded-full",
                                    }}
                                />


                            </div>
                            <Divider className='mb-2' />
                        </div>
                    </PopoverContent>

                </Popover>
                <LocationChip location={location} setLocation={setLocation} />

                <motion.div whileHover={{ scale: 1.1 }} >
                    <ReminderChip date={selectedDueDate} onSetReminder={handleSetReminder} />
                </motion.div>
                <Popover placement='bottom'>
                    <PopoverTrigger>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Chip
                                className={`cursor-pointer ml-2 rounded-xl ${getPriorityColor(priority)}`}
                                startContent={<FaChevronDown className='ml-1' />}
                            >
                                {priority ? <span className='font-bold text-lato text-md text-white'>{priority}</span> : 'Priority'}
                            </Chip>
                        </motion.div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="p-4">
                            <div className="flex flex-col space-y-2 mb-4">
                                <button className={`flex flex-row w-full hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 font-bold ${priority === 'low' ? 'bg-green-500 text-white' : ''}`}
                                    onClick={() => setPriority('low')}>
                                    Low Priority
                                </button>
                                <button className={`flex flex-row w-full hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 font-bold ${priority === 'medium' ? 'bg-yellow-500 text-white' : ''}`}
                                    onClick={() => setPriority('medium')}>
                                    Medium Priority
                                </button>
                                <button className={`flex flex-row w-full hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 font-bold ${priority === 'high' ? 'bg-red-500 text-white' : ''}`}
                                    onClick={() => setPriority('high')}>
                                    High Priority
                                </button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Checkbox defaultChecked={false} onChange={(e) => setIsDaily(e.target.checked)}>Daily Task</Checkbox>
            </div>
            <Button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-700"
                onClick={handleSave}
                endContent={<FaCheck />}
            >
                Save Task
            </Button>
            <Button
                className="mt-4 ml-2 px-4 py-2 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2   dark:focus:ring-gray-600"
                onClick={() => onClose()}
                color='danger'
                variant='shadow'
                endContent={<FaTimes />}
            >
                Cancel
            </Button>

        </motion.div >
    );
};

export default TaskCreationBox;
