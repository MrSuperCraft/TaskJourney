import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ModalContent, Chip, Popover, PopoverTrigger, PopoverContent, Calendar, Divider } from '@nextui-org/react';
import { db } from '@/app/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Task } from '@/app/dashboard/types';
import useUserData from '@/app/hooks/useUserData';
import { FaCalendar } from 'react-icons/fa';
import { DateValue } from '@nextui-org/react';
import { CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date';
import DateSearcher from '../DateSearcher';
import DateSelectionButtons from '../DateSelectionButtons';
import LocationChip from '../LocationChip';
import ReminderChip from '../ReminderChip';

interface TaskEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string | null;
}

const TaskEditorModal: React.FC<TaskEditorModalProps> = ({ isOpen, onClose, taskId }) => {
    const [task, setTask] = useState<Task | null>(null);
    const { userData }: any = useUserData();
    const uid = userData?.uid;

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedDueDate, setSelectedDueDate] = useState<CalendarDate | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [reminder, setReminder] = useState<Date | null>(null);

    const formattedDateString = dueDate ? dueDate.toISOString().split('T')[0] : undefined;
    const dueDateValue = dueDate ? parseDate(formattedDateString!) : undefined;
    const [value, setValue] = useState(dueDateValue);

    const handleSetReminder = (reminderDate: Date | null) => {
        if (reminderDate) {
            setReminder(reminderDate);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen && taskId) {
                const taskRef = doc(db, `users/${uid}/tasks/${taskId}`);
                const taskSnap = await getDoc(taskRef);
                if (taskSnap.exists()) {
                    const taskData = taskSnap.data() as Task;
                    setTask(taskData);
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchData();
    }, [isOpen, taskId, uid]);

    const handleDateChange = (value: DateValue | null) => {
        if (value) {
            const selectedDate = new Date(value.year, value.month - 1, value.day);
            const calendarDate = new CalendarDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
            setDueDate(selectedDate);
            setSelectedDueDate(calendarDate);
            setIsPopoverOpen(false);
        } else {
            setDueDate(null);
            setSelectedDueDate(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
            <ModalContent className="w-full max-w-3xl p-8">
                <ModalHeader>
                    <h2 id="modal-title" className="text-lg font-bold">
                        Edit Task
                    </h2>
                </ModalHeader>
                <ModalBody className="flex md:flex-row space-x-4">
                    <div className="w-full md:w-1/2">
                        <h3 className="text-xl font-semibold">{task?.title || 'No Data'}</h3>
                        <p className="text-base">{task?.description || 'No Data'}</p>
                    </div>
                    <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l">
                        <h4 className="text-lg font-semibold mb-4">Due Date</h4>
                        <Popover
                            placement="bottom-end"
                            offset={-250}
                            crossOffset={-150}
                            onClose={() => setIsPopoverOpen(false)}
                            showArrow={true}
                            shouldBlockScroll={true}
                            isOpen={isPopoverOpen}
                        >
                            <PopoverTrigger>
                                <Chip
                                    className={`bg-primary-brand-700 dark:bg-cyan-700 text-white cursor-pointer ml-2 rounded-xl`}
                                    startContent={<FaCalendar className='ml-1' />}
                                    onClick={() => setIsPopoverOpen(true)}
                                >
                                    {selectedDueDate ? (
                                        <span className='flex justify-between items-center w-full'>
                                            {selectedDueDate.toString()}
                                        </span>
                                    ) : (
                                        'Due Date'
                                    )}
                                </Chip>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="p-4">
                                    <DateSearcher dueDate={selectedDueDate} setDueDate={setSelectedDueDate}
                                        isPopoverOpen={isPopoverOpen} setPopoverOpen={setIsPopoverOpen}
                                    />
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
                                            value={selectedDueDate ?? today(getLocalTimeZone())}
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
                        <ReminderChip date={selectedDueDate} onSetReminder={handleSetReminder} />
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                    <Button onClick={onClose} className="mr-2">
                        Cancel
                    </Button>
                    <Button variant='flat' color="primary">
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskEditorModal;
