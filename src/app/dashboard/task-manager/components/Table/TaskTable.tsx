import React, { useState, useEffect } from 'react';
import {
    Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Button, Skeleton,
    Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Pagination
} from '@nextui-org/react';
import { FaEdit, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import Task from '../../types';
import EditTaskModal from '../EditModal';

interface TaskTableProps {
    tasks: Task[];
    title: string;
    darkMode?: boolean; // Optional prop for dark mode
    onTaskRemove: (taskId: string) => void;
    onUpdateTasks: (updatedTasks: Task[]) => void; // Add onUpdateTasks prop
}

enum Priority {
    low = 1,
    medium = 2,
    high = 3,
}


const TaskTable: React.FC<TaskTableProps> = ({ tasks, title, darkMode = false, onTaskRemove, onUpdateTasks }) => {
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Modal Editing States
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Pagination States
    const [page, setPage] = useState(1);
    const rowsPerPage = 5; // Number of tasks per page
    const pages = Math.ceil(tasks.length / rowsPerPage);

    // States for sorting
    const [sortCriteria, setSortCriteria] = useState<'title' | 'date' | 'priority'>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


    const sortTasks = (criteria: 'title' | 'date' | 'priority', order: 'asc' | 'desc') => {
        const newSortOrder = order === 'asc' ? 'desc' : 'asc'; // Toggle the sort order

        setSortCriteria(criteria); // Update sortCriteria state
        setSortOrder(newSortOrder); // Update sortOrder state

        const sortedTasks = [...tasks].sort((a, b) => {
            // Sort tasks based on criteria and order
            if (criteria === 'title') {
                return order === 'asc' ? a[criteria].localeCompare(b[criteria]) : b[criteria].localeCompare(a[criteria]);
            } else if (criteria === 'date' && a.date && b.date) {
                return order === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (criteria === 'priority') {
                // Custom sorting function for priority
                const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
                const priorityA = priorityOrder[a[criteria].toLowerCase()];
                const priorityB = priorityOrder[b[criteria].toLowerCase()];

                return order === 'asc' ? priorityA - priorityB : priorityB - priorityA;
            }
            return 0;
        });

        onUpdateTasks(sortedTasks);

        // Adjust page to the last page if it's beyond the new total pages
        const newPages = Math.ceil(sortedTasks.length / rowsPerPage);
        if (page > newPages) {
            setPage(newPages);
        }
    };




    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    /**
     * Handles the editing of a task.
     *
     * @param {string} taskId - The ID of the task to be edited.
     * @return {void} This function does not return a value.
     */
    const handleEdit = (taskId: string) => {
        const editedTaskForSend = tasks.find((task: Task) => task.id === taskId);
        setEditedTask(editedTaskForSend || null);
        setIsEditModalVisible(true);
    };

    /**
     * Handles the deletion of a task.
     *
     * @param {string} taskId - The ID of the task to be deleted.
     * @return {void} This function does not return a value.
     */
    const handleDelete = (taskId: string) => {
        // Set the task to the task with the specific ID that is passed over.
        const selectedTask = tasks.find((task: Task) => task.id === taskId);
        setSelectedTask(selectedTask || null);

        setIsModalVisible(true);
    };

    /**
     * Updates a task in the list of tasks.
     *
     * @param {Task} updatedTask - The task to be updated.
     * @return {void} This function does not return a value.
     */
    const handleTaskUpdate = (updatedTask: Task) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === updatedTask.id) {
                return updatedTask; // Update the task with the updatedTask data
            }
            return task; // Keep other tasks unchanged
        });
        onUpdateTasks(updatedTasks); // Call the prop function to update tasks
    };

    const confirmDelete = () => {
        if (selectedTask) {
            onTaskRemove(selectedTask?.id);
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
        return <Chip className={`${colorClass} text-white shadow-md`}> {priority}</Chip >;
    };

    const renderTaskCard = (task: Task) => {
        return (
            <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold text-black dark:text-white">{task.title}</h3>
                {/* shorten the task description to a maximum of 25 characters, then add an elipsis */}
                <p className="text-gray-600 dark:text-white">{task.description ? task.description.slice(0, 25) + '...' : ''}</p>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-600 dark:text-white line-clamp-1 text-sm">
                            {task.date} &middot; {task.location} &middot; {renderChip(task.priority)}
                        </span>
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={() => handleEdit(task.id)}
                        size="sm"
                        color={darkMode ? "primary" : "success"}
                        className="mr-2 text-white"
                        aria-label="Edit Task"
                        isIconOnly
                    >
                        <FaEdit aria-hidden="true" className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => handleDelete(task.id)}
                        size="sm"
                        className="bg-red-500 mr-2 text-white"
                        aria-label="Delete Task"
                        isIconOnly
                    >
                        <FaTrash aria-hidden="true" className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderSortIndicator = (criteria: 'title' | 'priority' | 'date') => {
        if (criteria === sortCriteria) {
            return sortOrder === 'asc' ? <FaChevronUp className="ml-1 mt-4" /> : <FaChevronDown className="ml-1" />;
        }
        return null;
    };

    const renderTasks = () => {

        // Sort tasks based on criteria and order
        const sortedTasks = [...tasks].sort((a, b) => {
            if (sortCriteria === 'title') {
                return sortOrder === 'asc' ? a[sortCriteria].localeCompare(b[sortCriteria]) : b[sortCriteria].localeCompare(a[sortCriteria]);
            } else if (sortCriteria === 'date') {
                // Handle tasks with no date separately
                if (!a.date && !b.date) {
                    return 0; // Both tasks have no date, keep them in the same order
                } else if (!a.date) {
                    return 1; // Task a has no date, move it to the end
                } else if (!b.date) {
                    return -1; // Task b has no date, move it to the end
                }
                // Both tasks have a date, proceed with date comparison
                return sortOrder === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (sortCriteria === 'priority') {
                // Compare priority based on their order (low, medium, high)
                const priorityA = Priority[a[sortCriteria] as keyof typeof Priority];
                const priorityB = Priority[b[sortCriteria] as keyof typeof Priority];
                return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
            }
            return 0;
        });


        // Ensure page stays within valid range
        const newPages = Math.ceil(sortedTasks.length / rowsPerPage);
        const validPage = Math.min(page, newPages);



        if (window.innerWidth < 768) {
            return (
                <div className="flex flex-wrap justify-center">
                    {tasks.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((task: Task) => (
                        <div key={task.id} className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-4">
                            {renderTaskCard(task)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <Table aria-label="Task Table" fullWidth className="shadow-md rounded-lg"

                    bottomContent={
                        pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={validPage} // Use validPage to ensure it's within range
                                    total={newPages} // Use newPages after sorting
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader>
                        <TableColumn className="text-sm relative" onClick={() => sortTasks('title', sortOrder)}>
                            <span className='flex flex-row'>Title {renderSortIndicator('title')}</span>
                        </TableColumn>
                        <TableColumn className="hidden sm:table-cell text-sm">Description</TableColumn>
                        <TableColumn className="text-sm relative" onClick={() => sortTasks('priority', sortOrder)}>
                            <span className='flex flex-row'>Priority {renderSortIndicator('priority')}</span>
                        </TableColumn>
                        <TableColumn className="hidden sm:table-cell text-sm relative" onClick={() => sortTasks('date', sortOrder)}>
                            <span className='flex flex-row'>Date {renderSortIndicator('date')}</span>
                        </TableColumn>
                        <TableColumn className="hidden lg:table-cell text-sm">Location</TableColumn>
                        <TableColumn className="text-sm">Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No tasks found. Create a new task with the \"Add Task\" button above."}>
                        {sortedTasks.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((task: Task) => (
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
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => handleEdit(task.id)}
                                            size="sm"
                                            color={darkMode ? "primary" : "success"}
                                            className="mr-2 text-white"
                                            aria-label="Edit Task"
                                            isIconOnly
                                        >
                                            <FaEdit aria-hidden="true" className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(task.id)}
                                            size="sm"
                                            className="bg-red-500 mr-2 text-white"
                                            aria-label="Delete Task"
                                            isIconOnly
                                        >
                                            <FaTrash aria-hidden="true" className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
    };

    return (
        <div>
            <div className="p-6">
                <h2 className={`text-2xl font-bold mb-4 dark:text-white text-gray-900`}>{title}</h2>
                {renderTasks()}
            </div>


            <EditTaskModal
                isOpen={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                task={editedTask}
                onUpdate={handleTaskUpdate}
            />
            <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
                <ModalContent>
                    <ModalHeader>
                        <h3 className="text-lg font-bold">Confirm Delete</h3>
                    </ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete this task?</p>
                        <p><strong>{selectedTask?.title}</strong></p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='flat' color="danger" onClick={confirmDelete}>
                            Delete
                        </Button>
                        <Button variant='ghost' onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default TaskTable;
