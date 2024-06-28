import React, { useState, useEffect, Key } from "react";
import TaskTable from "./Table/TaskTable";
import Task from "../types";
import useUserData from "../../../hooks/useUserData";
import { Button } from "@nextui-org/react";
import AddTaskButton from "./AddTaskButton";
import TaskCreationBox from "./TaskCreationBox";
import {
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
    collection,
    setDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDescription } from "@/app/contexts/EditorContext";
import { Tabs, Tab } from "@nextui-org/react";
import { FaCheckSquare, FaThumbtack } from "react-icons/fa";

type AvailableTasksTables = "active-tasks" | "completed-tasks";

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
            setActiveTasks(fetchedTasks.filter((task) => !task.complete));
            setDailyTasks(
                fetchedTasks.filter(
                    (task) => task.title && task.title.toLowerCase().includes("daily") && !task.complete
                )
            );
            setCompletedTasks(fetchedTasks.filter((task) => task.complete));
        }
    }, [userData]);

    const addTask = async (newTask: Task) => {
        try {
            if (userData?.uid) {
                const taskRef = await addDoc(
                    collection(db, `users/${userData.uid}/tasks`),
                    newTask
                );

                // Update local state based on task type
                if (!newTask.complete) {
                    setActiveTasks((prev) => [...prev, { ...newTask, id: taskRef.id }]);
                } else {
                    setCompletedTasks((prev) => [
                        ...prev,
                        { ...newTask, id: taskRef.id },
                    ]);
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
            if (userData?.uid) {
                const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
                await deleteDoc(taskDoc);

                // Update local state based on task type
                setActiveTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== taskId));
                setDailyTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== taskId));
                setCompletedTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== taskId));

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
            // Show error toast
            toast.error(`Failed to remove task: ${error.message}`);
            console.error(`Failed to delete task with ID: ${taskId}`, error);
        }
    };

    /**
     * Set the task with the given ID as completed in Firestore and locally.
     * This function updates the task document in Firestore with the completed status and
     * the current date as the completedAt field. It also updates the local state by 
     * removing the task from the active and daily tasks and adding it to the completed tasks.
     * Finally, it shows a success toast notification.
     * 
     * @param taskId The ID of the task to mark as completed.
     * @returns Promise<void>
     */
    const setTaskAsCompleted = async (taskId: string): Promise<void> => {
        try {
            // Check if userData is defined
            if (userData?.uid) {
                // Get the task document reference using the taskId
                const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
                // Get the current date as a string
                const completedAt = new Date().toDateString();

                // Update the task document in Firestore with the completed status and the completedAt field
                await updateDoc(taskDoc, {
                    complete: true,
                    completedAt: completedAt,
                });

                // Remove the task from active and daily tasks and add it to completed tasks in local state
                setActiveTasks((prev: Task[]) =>
                    prev.filter((task: Task) => task.id !== taskId)
                );
                setDailyTasks((prev: Task[]) =>
                    prev.filter((task: Task) => task.id !== taskId)
                );

                // Find the completed task in active or daily tasks
                const completedTask =
                    activeTasks.find((task: Task) => task.id === taskId) ||
                    dailyTasks.find((task: Task) => task.id === taskId);

                // If the completed task is found, add it to the completed tasks in local state
                if (completedTask) {
                    setCompletedTasks((prev: Task[]) => [
                        ...prev,
                        { ...completedTask, complete: true, completedAt: completedAt },
                    ]);
                }

                // Show success toast notification
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
                // Show error toast notification if userData is not defined
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
            // Show error toast notification if an error occurs
            toast.error(`Failed to complete task: ${(error as Error).message}`, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // Log the error to the console
            console.error(`Failed to complete task with ID: ${taskId}`, error);
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

                        <TaskTable
                            tableType="daily"
                            tasks={dailyTasks}
                            title="Daily Tasks"
                            onTaskRemove={removeTask}
                            onUpdateTasks={setDailyTasks}
                            onCompleteTask={setTaskAsCompleted}
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
