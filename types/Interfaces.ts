interface ITask {
    tasks: Task[];
}

interface Task extends ITask {
    id: string,
    name: string;
    isDone: boolean;
}

interface RootTask extends ITask {
}

export type { Task, RootTask, ITask };