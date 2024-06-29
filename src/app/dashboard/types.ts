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


interface Level {
    level: number;
    expForNextLevel: number;
    color: string;
    rewards: string[];
    description: string;
    progress: number;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    dateEarned?: Date;
}

interface Achievement {
    id: string;
    category: string;
    name: string;
    description: string;
    progress: number; // 0 to 100
    completed: boolean;
    dateCompleted?: Date;
}




export type { Task, Level, Badge, Achievement };
