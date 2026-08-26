import { Task } from "../models/task";

export const tasks: Task[] = [
    {
        id: 1,
        title: "Learn Node.js",
        description: "Study Express routing and middleware",
        completed: false
    },
     {
        id: 2,
        title: "Learn TypeScript",
        description: "Practice interfaces and modules",
        completed: true
    },
    {
        id: 3,
        title: "Build Task Manager",
        description: "Create an Express task management system",
        completed: false
    }
]