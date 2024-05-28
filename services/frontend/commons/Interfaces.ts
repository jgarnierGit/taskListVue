interface TaskList {
    tasks: Task[],
}

interface Task extends TaskList {
    id: string,
    name: string,
    isDone: boolean,
}


interface LazyLoadedNode {
    tree: TaskList,
    lazyLoadedIds: string[]
}

type JobResultType = { status: string, data: LazyLoadedNode | undefined };

export type { LazyLoadedNode, JobResultType, Task, TaskList };