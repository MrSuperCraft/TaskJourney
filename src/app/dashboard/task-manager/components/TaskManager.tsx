import React, { useState, useEffect, Key } from "react";
import TaskTable from "./Table/TaskTable";
import DailyTasksTable from "./Table/DailyTasksTable";
import { Task } from "../../types";
import useUserData from "../../../hooks/useUserData";
import AddTaskButton from "./AddTaskButton";
import TaskCreationBox from "./TaskCreationBox";
import {
    doc,
    deleteDoc,
    updateDoc,
    deleteField
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDescription } from "@/app/contexts/EditorContext";
import { Tabs, Tab } from "@nextui-org/react";
import { FaCheckSquare, FaThumbtack } from "react-icons/fa";


const TaskManager: React.FC = () => {
    const { userData } = useUserData();
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);
    const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [selectedTasksTable, setSelectedTasksTable] =
        useState<Key>("active-tasks");
    const [showTaskCreationBox, setShowTaskCreationBox] = useState(false);
    const { description, setDescription } = useDescription();

    useEffect(() => {
        if (userData) {
            const fetchedTasks: Task[] = userData.tasks ?? [];
            const active = fetchedTasks.filter((task) => !task.complete && !task.isDaily);
            const daily = fetchedTasks.filter((task) => task.isDaily);
            const completed = fetchedTasks.filter((task) => task.complete);

            setActiveTasks(active);
            setDailyTasks(daily);
            setCompletedTasks(completed);

            // Set up timers for daily tasks
            daily.forEach((task) => {
                if (task.refreshTime) {
                    const refreshTime = new Date(task.refreshTime).getTime();
                    updateTaskTimer(task.id, refreshTime);
                }
            });
        }
    }, [userData]);


    const addTask = async (newTask: Task) => {
        try {
            if (userData?.uid) {

                // Update local state based on task type
                if (!newTask.complete && !newTask.isDaily) {
                    setActiveTasks((prev) => [...prev, { ...newTask, id: newTask.id }]);
                } else if (newTask.isDaily) {
                    setDailyTasks((prev) => [...prev, { ...newTask, id: newTask.id }]);
                } else {
                    setCompletedTasks((prev) => [...prev, { ...newTask, id: newTask.id }]);
                }

                // Show success toast
                toast.success("Task successfully added!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("Failed to add the task. Try again soon.", {
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
            toast.error(`Failed to add task: ${(error as Error).message}`);
            console.error(`Failed to add task:`, error);
        }
    };

    /**
     * Remove the task with the given ID from Firestore and locally.
     * @param taskId The ID of the task to remove.
     * @returns Promise<void>
     */
    const removeTask = async (taskId: string): Promise<void> => {
        try {
            console.log("Attempting to remove task with ID:", taskId);
            if (userData?.uid) {
                const taskDocRef = doc(db, `users/${userData.uid}/tasks`, taskId);

                await deleteDoc(taskDocRef);

                console.log("Deleting task with ID:", taskId);
                // Update local state based on task type
                const activeTasksFiltered = (prev: Task[]) =>
                    prev.filter((task: Task) => task.id !== taskId);
                setActiveTasks(activeTasksFiltered);

                const dailyTasksFiltered = (prev: Task[]) =>
                    prev.filter((task: Task) => task.id !== taskId);
                setDailyTasks(dailyTasksFiltered);

                const completedTasksFiltered = (prev: Task[]) =>
                    prev.filter((task: Task) => task.id !== taskId);
                setCompletedTasks(completedTasksFiltered);

                console.log("Successfully removed task with ID:", taskId);
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
                console.log("User not authenticated. Failed to remove task with ID:", taskId);
                toast.error("Failed to remove the task. Try again soon.", {
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
        } catch (error: any) {
            console.error(`Failed to delete task with ID: ${taskId}`, error);
            // Show error toast
            toast.error(`Failed to remove task: ${error.message}`);
        }
    };
    const setTaskAsCompleted = async (taskId: string): Promise<void> => {
        try {
            if (userData?.uid) {
                const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
                const completedAt = new Date().toDateString();
                const task = activeTasks.find((task: Task) => task.id === taskId) || dailyTasks.find((task: Task) => task.id === taskId);

                if (task?.isDaily) {
                    const refreshTime = new Date();
                    refreshTime.setHours(24, 0, 0, 0); // Set refresh time to midnight

                    await updateDoc(taskDoc, {
                        complete: true,
                        completedAt: completedAt,
                        refreshTime: refreshTime.toISOString(),
                    });

                    setDailyTasks((prev: Task[]) =>
                        prev.map((t: Task) =>
                            t.id === taskId ? { ...t, complete: true, completedAt: completedAt, refreshTime: refreshTime.toISOString() } : t
                        )
                    );

                    // Set up timer to update the UI
                    updateTaskTimer(taskId, refreshTime.getTime());
                } else {
                    await updateDoc(taskDoc, {
                        complete: true,
                        completedAt: completedAt,
                    });

                    setActiveTasks((prev: Task[]) =>
                        prev.filter((task: Task) => task.id !== taskId)
                    );
                    setDailyTasks((prev: Task[]) =>
                        prev.filter((task: Task) => task.id !== taskId)
                    );

                    if (task) {
                        setCompletedTasks((prev: Task[]) => [
                            ...prev,
                            { ...task, complete: true, completedAt: completedAt },
                        ]);
                    }
                }

                toast.success("Task marked as completed!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("Failed to complete the task. Try again soon.", {
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
        } catch (error: unknown) {
            toast.error(`Failed to complete task: ${(error as Error).message}`, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error(`Failed to complete task with ID: ${taskId}`, error);
        }
    };


    const [timers, setTimers] = useState<Record<string, string>>({});

    const updateTaskTimer = (taskId: string, refreshTime: number) => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const remainingTime = refreshTime - currentTime;
            if (remainingTime <= 0) {
                clearInterval(interval);
                handleTaskRefresh(taskId);
            } else {
                const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
                const seconds = Math.floor((remainingTime / 1000) % 60);
                setTimers(prev => ({
                    ...prev,
                    [taskId]: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                }));
            }
        }, 1000);
    };

    const handleTaskRefresh = async (taskId: string) => {
        if (userData?.uid) {
            const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
            await updateDoc(taskDoc, {
                complete: false,
                completedAt: null,
                refreshTime: deleteField(),
            });
            setDailyTasks(prev =>
                prev.map(task => task.id === taskId ? { ...task, complete: false, completedAt: null, refreshTime: undefined } : task)
            );
        }
    };



    return (
        <div className="p-8 px-0 min-h-screen">
            <ToastContainer />
            <div className="w-[90%] mx-auto sm:w-full">
                <Tabs
                    selectedKey={selectedTasksTable as string}
                    onSelectionChange={setSelectedTasksTable}
                    className="w-full mx-auto sm:w-[90%]"
                >
                    <Tab
                        key="active-tasks"
                        title={
                            <span className="dark:text-white flex justify-center text-sm">
                                Active Tasks <FaThumbtack className="mt-1 ml-2" />
                            </span>
                        }
                    >
                        <AddTaskButton
                            onClick={() => {
                                setShowTaskCreationBox(true);
                                setDescription("");
                            }}
                        />

                        {showTaskCreationBox && (
                            <TaskCreationBox
                                onClose={() => setShowTaskCreationBox(false)}
                                onTaskAdd={addTask}
                            />
                        )}

                        <TaskTable
                            tableType="active"
                            tasks={activeTasks}
                            title="Your Tasks"
                            onTaskRemove={removeTask}
                            onUpdateTasks={setActiveTasks}
                            onCompleteTask={setTaskAsCompleted}
                        />

                        <DailyTasksTable
                            tableType="daily"
                            tasks={dailyTasks}
                            title="Daily Tasks"
                            onTaskRemove={removeTask}
                            onUpdateTasks={setDailyTasks}
                            onCompleteTask={setTaskAsCompleted}
                            timers={timers}
                        />
                    </Tab>
                    <Tab
                        key="completed-tasks"
                        title={
                            <span className="dark:text-white flex justify-center text-sm">
                                Completed Tasks <FaCheckSquare className="mt-1 ml-2" />
                            </span>
                        }
                    >
                        <TaskTable
                            tableType="completed"
                            tasks={completedTasks}
                            title="Completed Tasks"
                            onTaskRemove={removeTask}
                            onUpdateTasks={setCompletedTasks}
                            onCompleteTask={setTaskAsCompleted}
                        />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default TaskManager;
