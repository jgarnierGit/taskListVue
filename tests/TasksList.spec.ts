// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import TasksList from '@/components/TasksList.vue';
import { TaskStatus, type ITask, type RootTask } from '@/Interfaces';
import TaskManager from '~/components/TaskManager.vue';

describe('TasksList.vue', () => {
    async function createWrapper(task: ITask) {
        return mountSuspended(TasksList, {
            props: {
                task,
            },
        });
    };

    it('renders empty', async () => {
        const task: RootTask = {
            tasks: []
        };

        const wrapper = await createWrapper(task);

        const subtaskComponents = wrapper.findAllComponents(TaskManager);
        expect(subtaskComponents).toHaveLength(0);
    });

    it('renders subtasks correctly', async () => {
        // mock
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
        const subTaskIds = [1, 4, 2, 5, 3];
        const task: RootTask = {
            tasks: subtasks
        };

        const wrapper = await createWrapper(task);
        // expecting 2 level list
        const listComponents = wrapper.findAllComponents(TasksList);
        expect(listComponents).toHaveLength(2);
        // expecting 5 tasks
        const taskComponents = wrapper.findAllComponents(TaskManager);
        expect(taskComponents).toHaveLength(5);
        // checking ids order
        taskComponents.forEach((subtaskComponent, index) => {
            expect(subtaskComponent.props('task')).property('id').equal(subTaskIds[index]);
        });
    });
});
