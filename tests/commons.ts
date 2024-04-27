import { mountSuspended } from "@nuxt/test-utils/runtime";
import { TaskStatus, type RootTask, type Task } from "~/Interfaces";
import TasksList from "~/components/TasksList.vue";
/**
 * - 1
 *  - 1.1
 *  - 1.2
 *      - 1.2.1
 * - 2
 * @returns 
 */
export async function createWrapperWithData() {
    const subtasks = [
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
    ];
    const task: RootTask = {
        tasks: subtasks
    };
    return mountSuspended(TasksList, {
        props: {
            task,
        },
    });
};

export function getIdsOrder() {
    return [1, 4, 2, 5, 3];
}
