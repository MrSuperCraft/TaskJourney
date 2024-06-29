import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  Button,
  Input,
  Textarea,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import { FaCalendar, FaTimes } from 'react-icons/fa';
import DateSearcher from './DateSearcher';
import DateSelectionButtons from './DateSelectionButtons';
import { CalendarDate } from '@nextui-org/react';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
import { Task } from '../../types';
import { db } from '@/app/firebase';
import useUserData from '@/app/hooks/useUserData';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (updatedTask: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onUpdate }) => {
  // States for task values
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<CalendarDate | null>(convertToCalendarDate(task?.date || ''));
  const [location, setLocation] = useState(task?.location || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [selectedDueDate, setSelectedDueDate] = useState<CalendarDate | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [formattedDueDate, setFormattedDueDate] = useState('');


  // Get uid from auth
  const uid = useUserData().user?.uid;


  useEffect(() => {
    if (selectedDueDate) {
      setDueDate(selectedDueDate);
      setFormattedDueDate(formatDate(selectedDueDate));
    }
  }, [selectedDueDate]);



  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setDueDate(convertToCalendarDate(task?.date || ''));
    setLocation(task?.location || '');
    setPriority(task?.priority || 'medium');
    setSelectedDueDate(convertToCalendarDate(task?.date || ''));
  }, [task]);

  function convertToCalendarDate(dateString: string | undefined): CalendarDate | null {
    try {
      if (!dateString || !dateString.trim()) return null; // Return null if dateString is empty or undefined

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string'); // Throw an error if date parsing fails
      }

      const isoString = date.toISOString().split('T')[0]; // Get the ISO string in YYYY-MM-DD format
      return parseDate(isoString);
    } catch (error) {
      console.error('Error converting date:', error);
      return null; // Return null in case of any parsing error
    }
  }

  function formatDate(date: CalendarDate | null): string {
    if (!date) return '';
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US');
    return formattedDate;
  }


  const handleDateChange = (date: CalendarDate) => {
    setSelectedDueDate(date);
    setFormattedDueDate(formatDate(date));
    setIsPopoverOpen(false); // Close the popover when a date is selected
  };

  const getPriorityColor = (priority: string) => {
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

  const handleSave = async () => {
    if (!uid || !task?.id) {
      console.error("User not authenticated or task ID not available");
      return;
    }

    const taskDocRef = doc(db, `users/${uid}/tasks/${task?.id}`);
    const snapshot = await getDoc(taskDocRef);
    if (!snapshot.exists()) {
      console.error("No document to update");
      return;
    }

    const dateValue = dueDate ? dueDate.toDate(getLocalTimeZone()).toDateString() : '';

    await updateDoc(taskDocRef, {
      ...snapshot.data(),
      title,
      description,
      date: dateValue,
      location,
      priority,
    });

    const updatedTask: Task = {
      id: task.id, // Ensure the ID is valid
      title,
      description,
      date: dateValue,
      location,
      priority,
      createdAt: snapshot.data().createdAt,
      subtasks: snapshot.data().subtasks,
      complete: snapshot.data().complete,
      completedAt: snapshot.data().completedAt,
    };

    onUpdate(updatedTask);

    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size='3xl' className="p-4">
      <ModalContent className="rounded-lg shadow-lg w-full max-w-3xl mx-auto">
        <ModalHeader className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 max-md:border-none">
          <h2 className="text-xl font-semibold dark:text-white">Edit Task</h2>
        </ModalHeader>
        <ModalBody className="flex flex-col md:flex-row p-4">
          <div className="flex-1 flex flex-col pr-4 border-r max-md:border-none border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center mr-2">
                <span className="block w-3 h-3 bg-primary-brand rounded-full"></span>
              </div>
              <Input
                variant="bordered"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full dark:text-gray-300"
              />
            </div>
            <Textarea
              variant="bordered"
              rows={4}
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 dark:text-gray-300"
            />
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
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
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div
                      className="bg-gray-100 dark:bg-gray-800 border text-gray-700 dark:text-gray-300 cursor-pointer rounded-xl flex items-center justify-between px-4 py-2 transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsPopoverOpen(true)}
                    >
                      <FaCalendar className='mr-2' />
                      {formattedDueDate || 'Due Date'}

                    </div>

                  </motion.div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-4 relative">
                    <FaTimes
                      onClick={() => setIsPopoverOpen(false)}
                      className='w-6 h-6 md:hidden text-xs cursor-pointer rounded-full bg-opacity-50 bg-slate-200 dark:bg-slate-500 text-black dark:text-white absolute top-2 right-2 flex items-center justify-center hover:bg-opacity-100 transition duration-300 ease-in-out p-1'
                    />

                    <div className="mt-8">
                      <DateSearcher
                        dueDate={selectedDueDate}
                        setDueDate={setSelectedDueDate}
                        isPopoverOpen={isPopoverOpen}
                        setPopoverOpen={setIsPopoverOpen}
                      />
                    </div>
                    <Divider className='mb-2' />
                    <div className="flex flex-col space-y-2 mb-4">
                      <DateSelectionButtons
                        setSelectedDueDate={setSelectedDueDate}
                        selectedDueDate={selectedDueDate}
                        isPopoverOpen={isPopoverOpen}
                        setPopoverOpen={setIsPopoverOpen}
                        setDueDate={date => date ? setSelectedDueDate(parseDate(date.toISOString().split('T')[0])) : setSelectedDueDate(null)}
                        dueDate={selectedDueDate ? new Date(selectedDueDate.year, selectedDueDate.month - 1, selectedDueDate.day) : null}
                      />
                    </div>
                    <Divider className='mb-4' />
                    <div className="mb-4">
                      <Calendar
                        className='text-black dark:text-gray-300'
                        onChange={handleDateChange}
                        minValue={today(getLocalTimeZone())}
                        defaultValue={today(getLocalTimeZone())}
                        value={selectedDueDate ?? today(getLocalTimeZone())}
                        classNames={{
                          nextButton: "bg-black dark:bg-gray-700 text-white shadow-lg hover:bg-gray-800 dark:hover:bg-gray-600",
                          prevButton: "bg-black dark:bg-gray-700 text-white shadow-lg hover:bg-gray-800 dark:hover:bg-gray-600",
                          cellButton: "w-8 h-8 flex items-center justify-center rounded-full",
                        }}
                      />
                    </div>
                    <Divider className='mb-2' />
                  </div>

                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <Input
                variant="bordered"
                placeholder="Enter task location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full dark:text-gray-300"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="w-full text-left space-x-2 flex items-center dark:text-gray-300">
                    <span className={`w-4 h-4 ${getPriorityColor(priority)} rounded-md mr-2 inline-block`}></span>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Priority" className="w-full">
                  <DropdownItem key="low" textValue='low' onClick={() => setPriority('low')}>
                    <span className="w-4 h-4 bg-green-500 rounded-md mr-2 inline-block"></span>
                    Low
                  </DropdownItem>
                  <DropdownItem key="medium" textValue='medium' onClick={() => setPriority('medium')}>
                    <span className="w-4 h-4 bg-yellow-500 rounded-md mr-2 inline-block"></span>
                    Medium
                  </DropdownItem>
                  <DropdownItem key="high" textValue='high' onClick={() => setPriority('high')}>
                    <span className="w-4 h-4 bg-red-500 rounded-md mr-2  inline-block"></span>
                    High
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </ModalBody>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="light" onClick={onClose} className="mr-2 dark:text-gray-300 dark:bg-gray-700">
            Cancel
          </Button>
          <Button variant="bordered" onClick={handleSave} className="dark:text-gray-300">
            Save Changes
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
