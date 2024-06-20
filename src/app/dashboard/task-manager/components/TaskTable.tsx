import React, { useState, useEffect } from 'react';
import {
    Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Button, Skeleton,
    Modal, ModalHeader, ModalBody, ModalFooter, ModalContent
} from '@nextui-org/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Task from '../types';
import TaskEditorModal from './TaskEdit/TaskEditorModal';
import TaskModal from './TaskModal/TaskModal';


interface TaskTableProps {
    tasks: Task[];
    title: string;
    darkMode?: boolean; // Optional prop for dark mode
    onTaskRemove: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, title, darkMode = false, onTaskRemove }) => {
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleEdit = (taskId: string) => {
        console.log("Edit task: ", taskId);
        setEditedTaskId(taskId);
        setEditModalVisible(true);
        console.log("Edit modal visible: ", editModalVisible);
    }

    const handleDelete = (taskId: string) => {
        setSelectedTaskId(taskId);
        setIsModalVisible(true);
    };

    const handleSave = () => {
        console.log("saved");
    }

    const confirmDelete = () => {
        if (selectedTaskId) {
            onTaskRemove(selectedTaskId);
        }
        setIsModalVisible(false);
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
        <div className={`my-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{title}</h2>
            <Table aria-label="Task Table" className="min-w-full shadow-md rounded-lg">
                <TableHeader>
                    <TableColumn className="text-sm">Title</TableColumn>
                    <TableColumn className="hidden sm:table-cell text-sm">Description</TableColumn>
                    <TableColumn className="text-sm">Priority</TableColumn>
                    <TableColumn className="hidden sm:table-cell text-sm">Date</TableColumn>
                    <TableColumn className="hidden lg:table-cell text-sm">Location</TableColumn>
                    <TableColumn className="text-sm">Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No tasks found. Create a new task with the \"Add Task\" button above."}>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.title}</span></Skeleton> : <span className="dark:text-gray-300">{task.title}</span>}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.description && task.description.length > 25 ? task.description.substring(0, 25) + '...' : task.description}</span></Skeleton> :
                                    <span className="dark:text-gray-300 truncate" title={task.description}>{task.description && task.description.length > 25 ? task.description.substring(0, 25) + '...' : task.description}</span>
                                }
                            </TableCell>
                            <TableCell>
                                {loading ? <Skeleton className='rounded-md'>{renderChip(task.priority)}</Skeleton> : renderChip(task.priority)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.date != null ? task.date : 'N/A'}</span></Skeleton> : <span className="dark:text-gray-300">{task.date}</span>}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {loading ? <Skeleton className='rounded-md'><span className="dark:text-gray-300">{task.location != null ? task.location : 'N/A'}</span></Skeleton> : <span className="dark:text-gray-300">{task.location}</span>}
                            </TableCell>
                            <TableCell>
                                {loading ? (
                                    <Skeleton>
                                        <Button
                                            onClick={() => handleEdit(task.id)}
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
                                            onClick={() => handleEdit(task.id)}
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

            <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
                <ModalContent>
                    <ModalHeader>
                        <h2 id="modal-title">
                            Confirm Delete
                        </h2>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmDelete} variant='flat' color="danger">
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    );
};

export default TaskTable;
