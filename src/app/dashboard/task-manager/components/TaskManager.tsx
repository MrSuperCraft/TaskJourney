import React, { useState, useEffect } from 'react';
import TaskTable from './Table/TaskTable';
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
    const [originalTasksLength, setOriginalTasksLength] = useState<number>(0); // State for original tasks length

    const [showTaskCreationBox, setShowTaskCreationBox] = useState(false);
    const { description, setDescription } = useDescription();

    useEffect(() => {
        if (userData) {
            const fetchedTasks: Task[] = userData.tasks ?? [];
            setTasks(fetchedTasks);
            setOriginalTasksLength(fetchedTasks.length); // Update original tasks length
        }
    }, [userData]);

    const addTask = (newTask: Task) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setOriginalTasksLength(prev => prev + 1); // Increment original tasks length
    };

    const removeTask = async (taskId: string) => {
        try {
            if (userData?.uid) {
                // Delete task from Firestore
                const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
                await deleteDoc(taskDoc);

                // Update local state
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
                setOriginalTasksLength(prev => prev - 1); // Decrement original tasks length

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

    // Define the function to update tasks
    const handleUpdateTasks = (updatedTasks: Task[]) => {
        setTasks(updatedTasks);
    };

    return (
        <div className="p-8 min-h-screen">
            <ToastContainer />

            <AddTaskButton onClick={() => {
                setShowTaskCreationBox(true)
                setDescription('');
            }} />

            {showTaskCreationBox && (
                <TaskCreationBox onClose={() => setShowTaskCreationBox(false)} onTaskAdd={addTask}
                />
            )}

            <TaskTable tasks={highPriorityTasks} title="Your Tasks" onTaskRemove={removeTask} onUpdateTasks={handleUpdateTasks} />

            <TaskTable tasks={dailyTasks} title="Daily Tasks" onTaskRemove={removeTask} onUpdateTasks={handleUpdateTasks} />

        </div>
    );
};

export default TaskManager;
