interface ITask {
    tasks: Task[];
}

interface Task extends ITask {
    id: string,
    name: string;
    status: TaskStatus;
}

interface RootTask extends ITask {
}

/**
 * Enum Task status.
 * @readonly
 * @enum {string}
 */
export enum TaskStatus {
    CREATED = "CREATED",
    DONE = "DONE"
}

export type { Task, RootTask, ITask };