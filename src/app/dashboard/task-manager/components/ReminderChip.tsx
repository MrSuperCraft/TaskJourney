import { useState, useEffect } from 'react';
import { Popover, Button, Tabs, Tab, Spacer, Chip, Input, Card, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { FaClock } from 'react-icons/fa';
import { Key } from 'react';
import { CalendarDate } from '@nextui-org/react';

interface ReminderChipProps {
    date: CalendarDate | null;
    onSetReminder: (reminderDate: Date) => void;
}

const ReminderChip: React.FC<ReminderChipProps> = ({ date, onSetReminder }) => {
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'same-day' | 'one-day-before'>('same-day');
    const [selectedTime, setSelectedTime] = useState('');
    const [reminderText, setReminderText] = useState('Reminder');
    const [dueDate, setDueDate] = useState<CalendarDate | null>(null);
    const [reminderDate, setReminderDate] = useState<Date | null>(null);

    useEffect(() => {
        setDueDate(date);
    }, [date]);

    const handleOpen = () => setVisible(true);
    const handleClose = () => setVisible(false);
    const handleOptionChange = (key: Key) => {
        setSelectedOption(key as 'same-day' | 'one-day-before');
        updateReminderDate(key as 'same-day' | 'one-day-before', selectedTime);
    };

    const handleTimeChange = (e: any) => {
        const time = e.target.value;
        setSelectedTime(time);
        updateReminderDate(selectedOption, time);
    };

    const updateReminderDate = (option: 'same-day' | 'one-day-before', time: string) => {
        if (dueDate && time) {
            const dueDateObj = new Date(dueDate.year, dueDate.month - 1, dueDate.day); // Convert CalendarDate to Date
            const reminderDate = new Date(dueDateObj);
            if (option === 'one-day-before') {
                reminderDate.setDate(reminderDate.getDate() - 1);
            }
            const [hours, minutes] = time.split(':');
            reminderDate.setHours(Number(hours), Number(minutes));
            setReminderDate(reminderDate);
            setReminderText(reminderDate.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
        } else {
            setReminderDate(null);
            setReminderText('Reminder');
        }
    };

    const handleSaveReminder = () => {
        if (reminderDate) {
            onSetReminder(reminderDate);
        }
        handleClose();
    };

    return (
        <div>
            <Popover isOpen={visible} onClose={handleClose} placement="bottom">
                <motion.div whileHover={{ scale: 1.05 }}>
                    <PopoverTrigger>
                        <Chip
                            color="primary"
                            variant="flat"
                            startContent={<FaClock className='ml-2' />}
                            onClick={handleOpen}
                            className="bg-primary-brand-700 dark:bg-cyan-700 text-white cursor-pointer ml-2 rounded-xl"
                            onClose={() => { setSelectedTime(''); handleClose(); setReminderText('Reminder'); }} // Reset selected time and reminder text
                        >
                            {reminderText}
                        </Chip>
                    </PopoverTrigger>
                </motion.div>

                <PopoverContent>
                    <Card className='p-6 bg-white dark:bg-black shadow-lg rounded-lg'>
                        <h4 className="text-lg font-bold font-inter mb-2 text-gray-900 dark:text-gray-100">Set A Reminder</h4>
                        <Tabs selectedKey={selectedOption} onSelectionChange={handleOptionChange} variant='underlined'>
                            <Tab
                                key="same-day"
                                title={
                                    <span className={`px-4 py-2 rounded-lg `}>
                                        Same Day
                                    </span>
                                }
                            />
                            <Tab
                                key="one-day-before"
                                title={
                                    <span className={`px-4 py-2 rounded-lg `}>
                                        One Day Before
                                    </span>
                                }
                            />
                        </Tabs>
                        <Spacer y={1} />
                        <Input
                            type="time"
                            value={selectedTime}
                            onChange={handleTimeChange}
                            label="Select time"
                            placeholder="HH:MM"
                            className="mt-2"
                        />
                        <div className="mt-4 flex justify-end">
                            <Button variant="flat" onClick={handleSaveReminder}>Set Reminder</Button>
                        </div>
                    </Card>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default ReminderChip;
