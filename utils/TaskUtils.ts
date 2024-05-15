import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskList } from '~/types/Interfaces';

export function createTask() {
    return { id: uuidv4(), name: 'New task', tasks: [], isDone: false };
}

export function findTask(parent: TaskList, taskId: string): Task {
    const task = parent.tasks.find((t) => t.id === taskId);
    if (!task) {
        throw new Error(`Task ${taskId} not found`);
    }
    return task;
}

export function findTaskIndex(parent: TaskList, taskId: string): number {
    const index = parent.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
        throw new Error(`Task ${taskId} not found`);
    }
    return index;
}
