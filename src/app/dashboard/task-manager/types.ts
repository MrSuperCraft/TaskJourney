interface Task {
    id: string;
    title: string;
    stages?: string[];
    date?: string;
    description?: string;
    location?: string | null;
    reminder?: string;
    priority: "low" | "medium" | "high";
    createdAt: Date;
    subtasks: SubTask[];
    complete: boolean;
    completedAt: string | null;
    // Add more properties as needed
}

type SubTask = {
    id: string;
    parentTask: Task;
    task: Task;
}




export default Task;