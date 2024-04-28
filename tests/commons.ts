import { mountSuspended } from "@nuxt/test-utils/runtime";
import { TaskStatus, type RootTask, type Task } from "~/Interfaces";
import TasksList from "~/components/TasksList.vue";
import { ref } from 'vue';

/**
 * - 1
 *  - 1.1
 *  - 1.2
 *      - 1.2.1
 * - 2
 * @returns 
 */
export async function createWrapperWithData() {
    const tasks = ref([
        {
            id: 1,
            name: "1",
            status: TaskStatus.CREATED,
            tasks: [
                {
                    id: 4,
                    name: "1.1",
                    status: TaskStatus.CREATED,
                    tasks: [],
                },
                {
                    id: 2,
                    name: "1.2",
                    status: TaskStatus.DONE,
                    tasks: [
                        {
                            id: 5,
                            name: "1.2.1",
                            status: TaskStatus.DONE,
                            tasks: [],
                        },
                    ],
                },
            ],
        },
        {
            id: 3,
            name: "2",
            status: TaskStatus.DONE,
            tasks: [],
        },
    ]);
    const rootTask = { tasks: tasks.value };

    return mountSuspended(TasksList, {
        props: {
            task: rootTask,
        },
    });
};

export function getTaskIdByName(name: string): number {
    switch (name) {
        case '1': return 1;
        case '1.1': return 4;
        case '1.2': return 2;
        case '1.2.1': return 5;
        case '2': return 3;
        default:
            return -1;
    }
}

export function getIdsOrder() {
    return [1, 4, 2, 5, 3];
}
