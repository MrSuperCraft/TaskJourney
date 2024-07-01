import React, { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Chip,
    Button,
    Skeleton,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalContent,
    Pagination,
} from "@nextui-org/react";
import {
    FaEdit,
    FaTrash,
    FaChevronUp,
    FaChevronDown,
    FaCheck,
    FaRegCalendarAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { Task } from "../../../types";
import EditTaskModal from "../EditModal";

interface TaskTableProps {
    tasks: Task[];
    title: string;
    tableType: "active" | "daily" | "completed";
    darkMode?: boolean; // Optional prop for dark mode
    onTaskRemove: (taskId: string) => void;
    onUpdateTasks: (updatedTasks: Task[]) => void; // Add onUpdateTasks prop
    onCompleteTask: (taskId: string) => void;
    timers: Record<string, string>;
}

enum Priority {
    low = 1,
    medium = 2,
    high = 3,
}

const DailyTasksTable: React.FC<TaskTableProps> = ({
    tasks,
    title,
    tableType,
    darkMode = false,
    onTaskRemove,
    onUpdateTasks,
    onCompleteTask,
    timers
}) => {
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Refresh the tasks every time they change. This can be removed by using something like SWR
    useEffect(() => {
        setSortedTasks(tasks);
    }, [tasks]);

    // Modal Editing States
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Pagination States
    const [page, setPage] = useState(1);
    const rowsPerPage = 5; // Number of tasks per page
    const pages = Math.ceil(tasks.length / rowsPerPage);
    const [sortedTasks, setSortedTasks] = useState(tasks);


    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    // States for sorting
    const [sortCriteria, setSortCriteria] = useState<
        "title" | "date" | "priority"
    >("title");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const sortTasks = (
        criteria: "title" | "date" | "priority",
        order: "asc" | "desc"
    ) => {
        const newSortOrder = order === "asc" ? "desc" : "asc"; // Toggle the sort order

        setSortCriteria(criteria); // Update sortCriteria state
        setSortOrder(newSortOrder); // Update sortOrder state

        const sortedTasks = [...tasks].sort((a, b) => {
            // Sort tasks based on criteria and order
            if (criteria === "title") {
                return order === "asc"
                    ? a[criteria].localeCompare(b[criteria])
                    : b[criteria].localeCompare(a[criteria]);
            } else if (criteria === "date" && a.date && b.date) {
                return order === "asc"
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            } else if (criteria === "priority") {
                // Custom sorting function for priority
                const priorityOrder: Record<string, number> = {
                    high: 1,
                    medium: 2,
                    low: 3,
                };
                const priorityA = priorityOrder[a[criteria].toLowerCase()];
                const priorityB = priorityOrder[b[criteria].toLowerCase()];

                return order === "asc" ? priorityA - priorityB : priorityB - priorityA;
            }
            return 0;
        });

        setSortedTasks(sortedTasks);

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

    const handleEdit = (taskId: string) => {
        const editedTaskForSend = tasks.find((task: Task) => task.id === taskId);
        setEditedTask(editedTaskForSend || null);
        setIsEditModalVisible(true);
    };

    const handleDelete = (taskId: string) => {
        const selectedTask = tasks.find((task: Task) => task.id === taskId);
        setSelectedTask(selectedTask || null);
        setIsModalVisible(true);
    };

    const handleTaskUpdate = (updatedTask: Task) => {
        const updatedTasks = tasks.map((task) => {
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

    const handleComplete = (taskId: string) => {
        const selectedTask = tasks.find((task: Task) => task.id === taskId);
        if (selectedTask) {
            onCompleteTask(selectedTask?.id);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return darkMode ? "bg-red-400" : "bg-red-500"; // Red
            case "medium":
                return darkMode ? "bg-yellow-400" : "bg-yellow-500"; // Yellow
            case "low":
                return darkMode ? "bg-emerald-400" : "bg-emerald-500"; // Green
            default:
                return darkMode ? "bg-gray-400" : "bg-gray-500"; // Gray
        }
    };

    const renderChip = (priority: string) => {
        const colorClass = getPriorityColor(priority);
        return (
            <Chip className={`${colorClass} text-white shadow-md`}> {priority}</Chip>
        );
    };

    const renderSortIndicator = (criteria: "title" | "priority" | "date") => {
        if (criteria === sortCriteria) {
            return sortOrder === "asc" ? (
                <FaChevronUp className="ml-1 mt-1 align-middle inline-block" />
            ) : (
                <FaChevronDown className="ml-1 mt-1 align-middle inline-block" />
            );
        }
        return null;
    };

    const renderTasks = () => {
        const paginatedTasks = sortedTasks.slice(startIndex, endIndex);


        return paginatedTasks.map((task: Task) => (
            <TableRow key={task.id}>
                <TableCell className="dark:text-white">
                    {loading ? (
                        <Skeleton className="w-32 h-8 dark:text-gray-500 rounded-md" />
                    ) : (
                        task.title
                    )}
                </TableCell>

                <TableCell className="dark:text-white">
                    {loading ? (
                        <Skeleton className="w-32 h-8 dark:text-gray-500 rounded-md" />
                    ) : (
                        task.date || "N/A"
                    )}
                </TableCell>
                <TableCell>
                    {loading ? (
                        <Skeleton className="w-32 h-8 dark:text-gray-500 rounded-md" />
                    ) : (
                        renderChip(task.priority)
                    )}
                </TableCell>

                <TableCell className="flex">
                    {loading ? (
                        <Skeleton className="w-32 h-8 dark:text-gray-500 rounded-md" />
                    ) : (
                        task.isDaily && task.complete ? (
                            <span>{"Refreshes in: " + timers[task.id] || <Skeleton className="w-32 h-8 dark:text-gray-500 rounded-md" />}</span>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handleComplete(task.id)}
                                    size="sm"
                                    color="success"
                                    className="text-white mr-2"
                                    isIconOnly
                                    aria-label="Complete Task"
                                >
                                    <FaCheck aria-hidden="true" className="w-4 h-4" />
                                </Button>

                                <Button
                                    onClick={() => handleEdit(task.id)}
                                    size="sm"
                                    className="mr-2 text-white bg-primary-brand-700 hover:bg-primary-600 dark:bg-teal ease-in-out dark:ease-in-out dark:hover:bg-sky-600 transition-all dark:transition-all dark:duration-300 duration-300"
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
                            </>
                        )
                    )}
                </TableCell>

            </TableRow>
        ));
    };

    const renderTableHeader = () => {
        if (loading) {
            return (
                <TableHeader>
                    <TableColumn>
                        <Skeleton className="w-28 h-8 dark:text-gray-500 rounded-md" />
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="w-28 h-8 dark:text-gray-500 rounded-md" />
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="w-28 h-8 dark:text-gray-500 rounded-md" />
                    </TableColumn>
                    <TableColumn>
                        <Skeleton className="w-28 h-8 dark:text-gray-300" />
                    </TableColumn>
                </TableHeader>
            );
        }

        return (
            <TableHeader>
                <TableColumn
                    className="dark:text-white cursor-pointer"
                    onClick={() => sortTasks("title", sortOrder)}
                >
                    Title {renderSortIndicator("title")}
                </TableColumn>
                <TableColumn
                    className="dark:text-white cursor-pointer"
                    onClick={() => sortTasks("date", sortOrder)}
                >
                    Date {renderSortIndicator("date")}
                </TableColumn>
                <TableColumn
                    className="dark:text-white cursor-pointer"
                    onClick={() => sortTasks("priority", sortOrder)}
                >
                    Priority {renderSortIndicator("priority")}
                </TableColumn>

                <TableColumn className="dark:text-white">Actions</TableColumn>

            </TableHeader>
        );
    };

    const renderStackedTasks = () => {
        // Limit the rendering based on the amount of tasks
        const slicedTasks = tasks.slice(startIndex, endIndex);

        return slicedTasks.map((task) => (
            <div
                key={task.id}
                className="border-b border-gray-300 dark:border-gray-700 p-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md"
            >
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {task.title}
                        </h3>
                        {task.priority === "high" && (
                            <span className="text-xs font-semibold mt-0.5 px-2 py-1 bg-red-500 text-white rounded-lg">
                                High
                            </span>
                        )}
                        {task.priority === "medium" && (
                            <span className="text-xs font-semibold mt-0.5 px-2 py-1 bg-yellow-500 text-white rounded-lg">
                                Medium
                            </span>
                        )}
                        {task.priority === "low" && (
                            <span className="text-xs font-semibold mt-0.5 px-2 py-1 bg-green-500 text-white rounded-lg">
                                Low
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                        {task.description || "No description available"}
                    </p>
                    <div className="flex flex-row items-center space-x-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200 flex">
                            <FaRegCalendarAlt className="text-gray-600 dark:text-gray-200 mt-1 mr-1" />
                            {task.date || "No date available"}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 flex">
                            <FaMapMarkerAlt className="text-gray-600 dark:text-gray-200 mt-1 mr-1" />
                            {task.location || "No location available"}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row justify-end space-x-4 mt-2">

                    <>
                        <Button
                            onClick={() => handleComplete(task.id)}
                            size="sm"
                            color="success"
                            className="text-white"
                            isIconOnly
                            aria-label="Complete Task"
                        >
                            <FaCheck className="w-4 h-4 " />
                        </Button>
                        <Button
                            onClick={() => handleEdit(task.id)}
                            size="sm"
                            color="primary"
                            className="text-white"
                            aria-label="Edit Task"
                            isIconOnly
                        >
                            <FaEdit className="w-4 h-4 " />
                        </Button>

                        <Button
                            onClick={() => handleDelete(task.id)}
                            size="sm"
                            aria-label="Delete Task"
                            className="bg-red-500 text-white"
                            isIconOnly
                        >
                            <FaTrash className="w-4 h-4" />
                        </Button>
                    </>
                </div>
            </div>
        )).concat(renderPagination())
    };

    const renderPagination = () => {
        return (
            <Pagination
                className="flex justify-center mt-4 mb-10"
                total={pages}
                page={page}
                onChange={handlePageChange}
                isCompact
                showControls
                showShadow
            />
        );
    };

    const isMobile = window.innerWidth <= 768; // Check if device is mobile

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{title}</h2>

            {isMobile ? (
                <>
                    {renderStackedTasks()}
                </>
            ) : (
                <Table
                    aria-label="Task Table"
                    className="mb-6"
                    bottomContent={
                        <Pagination
                            className="flex justify-center mt-4"
                            total={pages}
                            page={page}
                            onChange={setPage}
                            isCompact
                            showControls
                            showShadow
                        />
                    }
                >
                    {renderTableHeader()}
                    <TableBody
                        emptyContent={
                            <span className="font-medium font-inter text-center text-xl">
                                No tasks found, please add a task to get started.
                            </span>
                        }
                    >
                        {renderTasks()}
                    </TableBody>
                </Table>
            )}

            {selectedTask && (
                <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
                    <ModalContent>
                        <ModalHeader>Confirm Delete</ModalHeader>
                        <ModalBody>
                            <p>{`Are you sure you want to delete the task ${selectedTask.title}?`}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => setIsModalVisible(false)} variant="ghost">
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} className="bg-red-500 text-white">
                                Delete
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
            {editedTask && (
                <EditTaskModal
                    isOpen={isEditModalVisible}
                    onClose={() => setIsEditModalVisible(false)}
                    task={editedTask}
                    onUpdate={handleTaskUpdate} // Update task using handleTaskUpdate function
                />
            )}
        </div>
    );
};

export default DailyTasksTable;
