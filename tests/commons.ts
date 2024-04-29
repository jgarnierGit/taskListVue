import { mountSuspended } from "@nuxt/test-utils/runtime";
import { TaskStatus, type RootTask, type Task } from "~/Interfaces";
import TasksList from "~/components/TasksList.vue";
import { ref } from 'vue';
import TaskManager from "~/components/TaskManager.vue";

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
            id: "1",
            name: "1",
            status: TaskStatus.CREATED,
            tasks: [
                {
                    id: "4",
                    name: "1.1",
                    status: TaskStatus.CREATED,
                    tasks: [],
                },
                {
                    id: "2",
                    name: "1.2",
                    status: TaskStatus.DONE,
                    tasks: [
                        {
                            id: "5",
                            name: "1.2.1",
                            status: TaskStatus.DONE,
                            tasks: [],
                        },
                    ],
                },
            ],
        },
        {
            id: "3",
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

export async function createWrapperEmpty() {
    const tasks = ref([]);
    const rootTask = { tasks: tasks.value };
    return mountSuspended(TasksList, {
        props: {
            task: rootTask,
        },
    });
}

export function getTaskIdByName(name: string): string {
    switch (name) {
        case '1': return '1';
        case '1.1': return '4';
        case '1.2': return '2';
        case '1.2.1': return '5';
        case '2': return '3';
        default:
            return '';
    }
}

export function getIdsOrder() {
    return ['1', '4', '2', '5', '3'];
}

/**
 * Get components attached to a Task assuming :
 * - component is accessible and visible, 
 * - component has a Task as prop
 * @param wrapper 
 * @param component 
 * @param name 
 * @returns Component
 */
export function getDirectComponentByTaskName(wrapper: any, component: any, name: string) {
    const subComponents = wrapper.findAllComponents(component);
    return subComponents.find((subComp: any) => subComp.props('task').name === name);
}

/**
 * Get components attached to a Task assuming :
 * - component is accessible and visible, 
 * - component has a taskId as prop
 * @param wrapper 
 * @param component 
 * @param name 
 * @returns Component
 */
export function getDirectComponentByTaskId(wrapper: any, component: any, name: string) {
    const subComponents = wrapper.findAllComponents(component);
    return subComponents.find((subComp: any) => subComp.props('taskId') === name);
}

/**
 * get flat list index 
 * @param wrapper 
 * @param name 
 * @returns 
 */
export function getTaskIndexByName(wrapper: any, name: string): number {
    const subComponents = wrapper.findAllComponents(TaskManager);
    return subComponents.findIndex((taskComp: any) => taskComp.props('task').name === name);
}