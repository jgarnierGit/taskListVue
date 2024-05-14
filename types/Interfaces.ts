interface TaskList {
    tasks: Task[];
}

interface Task extends TaskList {
    id: string,
    name: string;
    isDone: boolean;
}

export type { Task, TaskList };