import { Modal, ModalBody } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import LocationPicker from './LocationPicker';
import PriorityPicker from './PriorityPicker';
import ReminderPicker from './ReminderPicker';
import CommentSection from './CommentSection';
import SubtaskEditor from './SubTaskEditor';
import useUserData from '@/app/hooks/useUserData';
import Task from '../../types';
import { db } from '@/app/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface TaskEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string | null;
}

const TaskModal: React.FC<TaskEditorModalProps> = ({ isOpen, taskId, onClose }) => {
    const [task, setTask] = useState<Task | null>(null);


    const { userData }: any = useUserData();
    const uid = userData?.uid;

    // Fetching logic    
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




    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [location, setLocation] = useState<string>('');
    const [priority, setPriority] = useState<string>('');
    const [reminder, setReminder] = useState<Date | null>(null);
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [comments, setComments] = useState<string>('');

    const handleDateChange = (date: Date) => {
        setDueDate(date);
    };

    const handleLocationChange = (location: string) => {
        setLocation(location);
    };

    const handlePriorityChange = (priority: string) => {
        setPriority(priority);
    };

    const handleReminderChange = (date: Date) => {
        setReminder(date);
    };

    const handleSubtaskChange = (subtasks: string[]) => {
        setSubtasks(subtasks);
    };

    const handleCommentChange = (comment: string) => {
        setComments(comment);
    };


    return (
        <Modal size="lg" isOpen={isOpen} onClose={onClose}>
            <ModalBody>
                <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
                />
                <div className="relative flex size-full min-h-screen flex-col bg-[#f9fbfb] justify-between group/design-root overflow-x-hidden">
                    <div>
                        <div className="flex items-center bg-[#f9fbfb] p-4 pb-2 justify-between">
                            <div
                                className="text-[#101919] flex size-12 shrink-0 items-center cursor-pointer"
                                onClick={onClose}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24px"
                                    height="24px"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                >
                                    <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                                </svg>
                            </div>
                            <div className="flex w-12 items-center justify-end">
                                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#101919] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
                                    <div className="text-[#101919]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24px"
                                            height="24px"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                        >
                                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15L215.8,100.45a8,8,0,0,0-1.75,5Z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>Integrations</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="p-8 pl-8 pt-0">
                            <div className="gap-12">
                                <div className="mb-6 flex flex-row gap-12 items-center">
                                    <div className="min-w-[48px] max-w-[48px] min-h-[48px] max-h-[48px] rounded-lg bg-[#fff] flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32px"
                                            height="32px"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                        >
                                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15L215.8,100.45a8,8,0,0,0-1.75,5Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-sans text-xl leading-7 font-normal tracking-wide text-[#707070]">
                                            Task
                                        </p>
                                        <div>
                                            <h1 className="font-sans text-4xl font-bold leading-[50px] tracking-tight text-[#101919]">
                                                {task?.title}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <p className="text-xl font-normal leading-7 tracking-[0.015em] text-[#101919]">
                                        {task?.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mb-4 h-[2px] bg-[#d1d1d1]" />
                            <div>
                                <div className="flex flex-col gap-12 p-0 md:flex-row md:justify-between">
                                    <div className="flex-1 flex-col p-0">
                                        <div className="flex flex-col gap-6">
                                            <div className="gap-4 flex flex-row justify-between">
                                                <button
                                                    className="flex max-w-[480px] cursor-pointer items-center justify-between rounded-lg border border-solid border-[#d1d1d1] bg-transparent py-2.5 px-4"
                                                >
                                                    <span className="font-sans text-xl font-semibold leading-7 text-[#101919]">
                                                        Due Date
                                                    </span>
                                                    <span className="font-sans text-lg font-semibold leading-7 text-[#707070]">
                                                        {task?.date}
                                                    </span>
                                                </button>
                                                <button
                                                    className="flex max-w-[480px] cursor-pointer items-center justify-between rounded-lg border border-solid border-[#d1d1d1] bg-transparent py-2.5 px-4"
                                                >
                                                    <span className="font-sans text-xl font-semibold leading-7 text-[#101919]">
                                                        Location
                                                    </span>
                                                    <span className="font-sans text-lg font-semibold leading-7 text-[#707070]">
                                                        {task?.location}
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="gap-4 flex flex-row justify-between">
                                                <button
                                                    className="flex max-w-[480px] cursor-pointer items-center justify-between rounded-lg border border-solid border-[#d1d1d1] bg-transparent py-2.5 px-4"
                                                >
                                                    <span className="font-sans text-xl font-semibold leading-7 text-[#101919]">
                                                        Priority
                                                    </span>
                                                    <span className="font-sans text-lg font-semibold leading-7 text-[#707070]">
                                                        {task?.priority}
                                                    </span>
                                                </button>
                                                <button
                                                    className="flex max-w-[480px] cursor-pointer items-center justify-between rounded-lg border border-solid border-[#d1d1d1] bg-transparent py-2.5 px-4"
                                                >
                                                    <span className="font-sans text-xl font-semibold leading-7 text-[#101919]">
                                                        Reminder
                                                    </span>
                                                    <span className="font-sans text-lg font-semibold leading-7 text-[#707070]">
                                                        {task?.reminder}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex-col p-0">
                                        <div className="flex flex-col gap-6">
                                            <div className="gap-4 flex flex-row justify-between">
                                                <button
                                                    className="flex max-w-[480px] cursor-pointer items-center justify-between rounded-lg border border-solid border-[#d1d1d1] bg-transparent py-2.5 px-4"
                                                >
                                                    <span className="font-sans text-xl font-semibold leading-7 text-[#101919]">
                                                        Subtasks
                                                    </span>
                                                </button>
                                                <button
                                                    className="flex max-w-[480px] cursor-pointer items-center justify-between rounded-lg border border-solid border-[#d1d1d1] bg-transparent py-2.5 px-4"
                                                >
                                                    <span className="font-sans text-xl font-semibold leading-7 text-[#101919]">
                                                        Comments
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <DatePicker onDateChange={handleDateChange} dueDate={dueDate} />
                            <LocationPicker onLocationChange={handleLocationChange} />
                            <PriorityPicker onPriorityChange={handlePriorityChange} />
                            <ReminderPicker onReminderChange={handleReminderChange} />
                            <SubtaskEditor onSubtaskChange={handleSubtaskChange} />
                            <CommentSection onCommentChange={handleCommentChange} />
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default TaskModal;
