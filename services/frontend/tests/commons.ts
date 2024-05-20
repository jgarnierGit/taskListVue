import { mountSuspended } from "@nuxt/test-utils/runtime";
import TasksList from "~/components/TasksSubList.vue";
import { ref } from 'vue';
import TaskManager from "~/components/TaskManager.vue";
import { config } from '@vue/test-utils';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVuetify } from 'vuetify';
import type { TaskList } from "~/commons/Interfaces";
import TaskListTree from "~/components/TaskListTree.vue";

const vuetify = createVuetify({
    components,
    directives,
});

global.ResizeObserver = require('resize-observer-polyfill')

config.global.plugins.push(vuetify);

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
            isDone: false,
            tasks: [
                {
                    id: "4",
                    name: "1.1",
                    isDone: false,
                    tasks: [],
                },
                {
                    id: "2",
                    name: "1.2",
                    isDone: true,
                    tasks: [
                        {
                            id: "5",
                            name: "1.2.1",
                            isDone: true,
                            tasks: [],
                        },
                    ],
                },
            ],
        },
        {
            id: "3",
            name: "2",
            isDone: true,
            tasks: [],
        },
    ]);
    const root = { tasks: tasks.value };

    return mountSuspended(TaskListTree, {
        props: {
            modelValue: root,
        },
        global: {
            plugins: [vuetify]
        }
    });
};
export async function createWrapperWithTask(comp: any, task: TaskList) {
    return mountSuspended(comp, {
        props: {
            task: reactive(task),
        },
        global: {
            plugins: [vuetify]
        }
    });
}

export async function createWrapperEmpty() {
    const tasks = ref([]);
    const root = { tasks: tasks.value } as TaskList;
    return mountSuspended(TaskListTree, {
        props: {
            modelValue: root,
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
