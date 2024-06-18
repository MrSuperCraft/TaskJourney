interface Task {
    id: string;
    title: string;
    stages?: string[];
    date?: string;
    description?: string;
    location?: string | null;
    image?: string;
    reminder?: string;
    priority: "low" | "medium" | "high";
    createdAt: Date;
    // Add more properties as needed
}



export default Task;