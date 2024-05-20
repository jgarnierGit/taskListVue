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

export type { LazyLoadedNode, Task, TaskList };