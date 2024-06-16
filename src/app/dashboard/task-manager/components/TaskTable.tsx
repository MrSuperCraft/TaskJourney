import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Button, Skeleton } from '@nextui-org/react';
import Task from '../types';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface TaskTableProps {
    tasks: Task[];
    title: string;
    darkMode?: boolean; // Optional prop for dark mode
    onTaskRemove: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, title, darkMode = false, onTaskRemove }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleEdit = (task: Task) => {
        // Handle edit task
        console.log("Edit task", task);
    };

    const handleDelete = (taskId: string) => {
        // Handle delete task
        onTaskRemove(taskId);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return darkMode ? 'bg-red-400' : 'bg-red-500'; // Red
            case 'medium':
                return darkMode ? 'bg-yellow-400' : 'bg-yellow-500'; // Yellow
            case 'low':
                return darkMode ? 'bg-emerald-400' : 'bg-emerald-500'; // Green
            default:
                return darkMode ? 'bg-gray-400' : 'bg-gray-500'; // Gray
        }
    };

    const renderChip = (priority: string) => {
        const colorClass = getPriorityColor(priority);
        return <Chip className={`${colorClass} text-white shadow-md`}>{priority}</Chip>;
    };

    return (
        <div className={`my-6 ${darkMode ? 'dark:text-white' : 'dark:text-gray-300'}`}>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <Table aria-label="Task Table" className={`min-w-full shadow-md rounded-lg`}>
                <TableHeader>
                    <TableColumn className="dark:text-gray-300 text-sm">Title</TableColumn>
                    <TableColumn className="dark:text-gray-300 text-sm">Description</TableColumn>
                    <TableColumn className="dark:text-gray-300 text-sm">Priority</TableColumn>
                    <TableColumn className="dark:text-gray-300 text-sm">Date</TableColumn>
                    <TableColumn className="dark:text-gray-300 text-sm">Location</TableColumn>
                    <TableColumn className="dark:text-gray-300 text-sm">Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No tasks found. Create a new task with the \"Add Task\" button above."}>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.title}</span></Skeleton> : <span className="dark:text-gray-300">{task.title}</span>}
                            </TableCell>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.description}</span></Skeleton> : <span className="dark:text-gray-300">{task.description}</span>}
                            </TableCell>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'>{renderChip(task.priority)}</Skeleton> : renderChip(task.priority)}
                            </TableCell>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.date}</span></Skeleton> : <span className="dark:text-gray-300">{task.date}</span>}
                            </TableCell>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.location}</span></Skeleton> : <span className="dark:text-gray-300">{task.location}</span>}
                            </TableCell>
                            <TableCell>
                                {loading ? (
                                    <Skeleton >
                                        <Button
                                            onClick={() => handleEdit(task)}
                                            size="sm"
                                            color={darkMode ? "primary" : "success"}
                                            className="mr-2 text-white"
                                            aria-label="Edit Task"
                                        >
                                            <FaEdit aria-hidden="true" />Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(task.id)}
                                            size="sm"
                                            className="bg-red-500 text-white"
                                            aria-label="Delete Task"
                                        >
                                            <FaTrash aria-hidden="true" /> Delete
                                        </Button>
                                    </Skeleton>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => handleEdit(task)}
                                            size="sm"
                                            color={darkMode ? "primary" : "success"}
                                            className="mr-2 text-white"
                                            aria-label="Edit Task"
                                        >
                                            <FaEdit aria-hidden="true" />Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(task.id)}
                                            size="sm"
                                            className="bg-red-500 text-white"
                                            aria-label="Delete Task"
                                        >
                                            <FaTrash aria-hidden="true" /> Delete
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TaskTable;
