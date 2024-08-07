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
    isDaily: boolean;
    refreshTime?: string | null;
    // Add more properties as needed
}


type Event = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    description?: string;
};


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
    id: number;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    dateEarned?: Date;
}
interface Achievement {
    id: number;
    category: string;
    name: string;
    description: string;
    progress: number;
    completed: boolean;
    dateCompleted: Date | string | null;
    requirements: Record<string, number>;  // New property for requirements
}


interface Statistics {
    id: string;
    tasksCreated: number;
    tasksCompleted: number;
    streaks: number;
    calendarEvents: number;
    dailyQuestsCompleted: number;
    achievementsUnlocked: number;
    badgesEarned: number;
    tasksCreatedToday: number;
    tasksCompletedToday: number;
    exp: number;
    level: number;
    eventsAttended: number;
    friendsConnected: number;
    completedAchivements: number;
}



type Goal = {
    id?: string;
    name: string;
    category: string;
    tags: string[];
    description: string;
    stages: any[];
    createdAt: Date | string;
    updatedAt: Date | string;
    archived: boolean;
    archivedAt?: Date;
}




export type { Task, Level, Badge, Achievement, Event, Statistics, Goal };