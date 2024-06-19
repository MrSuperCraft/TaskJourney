'use client';

import React, { useState, useEffect } from 'react';
import TaskTable from '../components/TaskTable';
import Task from '../types';
import useUserData from '../../../hooks/useUserData'; // Ensure this hook fetches tasks as well
import { Button } from '@nextui-org/react';
import AddTaskButton from './AddTaskButton';
import TaskCreationBox from './TaskCreationBox';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDescription } from '@/app/contexts/EditorContext';


const TaskManager: React.FC = () => {

    const { userData } = useUserData();
    const [tasks, setTasks] = useState<Task[]>([]);

    const [highPriorityTasksToShow, setHighPriorityTasksToShow] = useState(5);
    const [soonComingTasksToShow, setSoonComingTasksToShow] = useState(5);
    const [dailyTasksToShow, setDailyTasksToShow] = useState(5);
    const [showTaskCreationBox, setShowTaskCreationBox] = useState(false);
    const { description, setDescription } = useDescription();



    useEffect(() => {
        if (userData) {
            const fetchedTasks: Task[] = userData.tasks ?? [];
            setTasks(fetchedTasks);
        }
    }, [userData]);

    const addTask = (newTask: Task) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const removeTask = async (taskId: string) => {
        try {
            // Delete task from Firestore
            if (userData?.uid) {
                console.log(`Attempting to delete task with ID: ${taskId}`);
                const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
                await deleteDoc(taskDoc);

                // Update local state
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

                // Show success toast
                toast.success("Task successfully removed!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('Failed to remove the task. Try again soon.', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                throw new Error("User not authenticated");
            }
        } catch (error) {
            // Show error toast
            toast.error(`Failed to remove task: ${(error as Error).message}`);
            console.error(`Failed to delete task with ID: ${taskId}`, error);
        }
    };

    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    };
    // High Priority Tasks: Sort by priority, then by date, with tasks without a date last
    const highPriorityTasks = [...tasks].sort((a, b) => {
        const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDifference !== 0) {
            return priorityDifference;
        }
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
    });

    // Almost Overdue Tasks: Sort by date, with tasks without a date last
    const almostOverdueTasks = [...tasks].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
    });

    // Daily Tasks: Filter tasks that include 'daily' in the title
    const dailyTasks = tasks.filter(task => task.title.toLowerCase().includes('daily'));

    const loadMoreHighPriorityTasks = () => setHighPriorityTasksToShow(prev => prev + 5);
    const loadMoreSoonComingTasks = () => setSoonComingTasksToShow(prev => prev + 5);
    const loadMoreDailyTasks = () => setDailyTasksToShow(prev => prev + 5);

    return (
        <div className="p-8 min-h-screen">
            <ToastContainer />

            <AddTaskButton onClick={() => {
                setShowTaskCreationBox(true)
                setDescription('');
            }} />

            {showTaskCreationBox && (
                <TaskCreationBox onClose={() => setShowTaskCreationBox(false)} onTaskAdd={addTask} />
            )}

            <TaskTable tasks={highPriorityTasks.slice(0, highPriorityTasksToShow)} title="High Priority Tasks" onTaskRemove={removeTask} />
            {highPriorityTasks.length > highPriorityTasksToShow && (
                <Button color="primary" onClick={loadMoreHighPriorityTasks} className="mt-4">
                    Load More Tasks
                </Button>
            )}

            <TaskTable tasks={almostOverdueTasks.slice(0, soonComingTasksToShow)} title="Almost Overdue" onTaskRemove={removeTask} />
            {almostOverdueTasks.length > soonComingTasksToShow && (
                <Button color="primary" onClick={loadMoreSoonComingTasks} className="mt-4">
                    Load More Tasks
                </Button>
            )}

            <TaskTable tasks={dailyTasks.slice(0, dailyTasksToShow)} title="Daily Tasks" onTaskRemove={removeTask} />
            {dailyTasks.length > dailyTasksToShow && (
                <Button color="primary" onClick={loadMoreDailyTasks} className="mt-4">
                    Load More Tasks
                </Button>
            )}
        </div>
    );
};

export default TaskManager;
