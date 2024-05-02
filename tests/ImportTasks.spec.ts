// @vitest-environment nuxt
import { assert, describe, expect, it, vitest } from 'vitest';
import ImportTasks from '../components/ImportTasks.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { type RootTask, TaskStatus, type Task } from '~/Interfaces';
import { createWrapperEmpty } from './commons';
import TaskManager from '~/components/TaskManager.vue';
import { VueWrapper, flushPromises } from '@vue/test-utils';
import { waitFor } from '@testing-library/vue';

describe('Import tasks', () => {

    async function loadJson(importWrapper: VueWrapper, tasks: any) {
        // lots of duplicated code but importWrapper type is hell
        const importFile = new File([JSON.stringify(tasks)], 'tasks.json', {
            type: 'application/json',
        });
        // set the input file
        const importInput = importWrapper.find<HTMLInputElement>('input[type="file"]');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(importFile);
        importInput.element.files = dataTransfer.files as FileList;
        await importInput.trigger('change');
    }

    it('imports tasks correctly', async () => {
        const tasks = {
            tasks: [
                {
                    id: '1',
                    name: 'Task 1',
                    status: TaskStatus.CREATED,
                    tasks: [{
                        id: '3',
                        name: 'Task 3',
                        status: TaskStatus.CREATED,
                        tasks: [],
                    }],
                },
                {
                    id: '2',
                    name: 'Task 2',
                    status: TaskStatus.DONE,
                    tasks: [],
                },
            ]
        };
        const emptyTasks: Task[] = [];
        const rootTask = reactive<RootTask>({ tasks: emptyTasks });
        const importWrapper = await mountSuspended(ImportTasks, {
            props: {
                modelValue: rootTask,
            },
        });

        await loadJson(importWrapper, tasks);
        await waitFor(() => expect(importWrapper.emitted()['importedTasksList']).toHaveLength(1));
        expect(JSON.stringify(importWrapper.vm.modelValue)).toEqual(JSON.stringify(tasks));
    });

    it('imports tasks fails, root malformed, expected no import', async () => {
        // tas => tasks
        const tasks = {
            tas: [
                {
                    id: '1',
                    name: 'Task 1',
                    status: TaskStatus.CREATED,
                    tasks: [{
                        id: '3',
                        name: 'Task 3',
                        status: TaskStatus.CREATED,
                        tasks: [],
                    }],
                },
                {
                    id: '2',
                    name: 'Task 2',
                    status: TaskStatus.DONE,
                    tasks: [],
                },
            ]
        };

        const emptyTasks: Task[] = [];
        const rootTask = reactive<RootTask>({ tasks: emptyTasks });
        const importWrapper = await mountSuspended(ImportTasks, {
            props: {
                modelValue: rootTask,
            },
        });
        await loadJson(importWrapper, tasks);
        // Mock the alert function
        const originalAlert = window.alert;
        window.alert = vitest.fn();
        await waitFor(() => expect(window.alert).toHaveBeenCalled());
        expect(JSON.stringify(importWrapper.vm.modelValue)).toEqual(JSON.stringify({ tasks: [] }));
        // Restore the original alert function
        window.alert = originalAlert
    });

    it('imports tasks fails: child missing properties, expected no import', async () => {
        // first child: missing id and name
        const tasks = {
            tasks: [
                {
                    status: TaskStatus.CREATED,
                    tasks: [{
                        id: '3',
                        name: 'Task 3',
                        status: TaskStatus.CREATED,
                        tasks: [],
                    }],
                },
                {
                    id: '2',
                    name: 'Task 2',
                    status: TaskStatus.DONE,
                    tasks: [],
                },
            ]
        };

        const emptyTasks: Task[] = [];
        const rootTask = reactive<RootTask>({ tasks: emptyTasks });
        const importWrapper = await mountSuspended(ImportTasks, {
            props: {
                modelValue: rootTask,
            },
        });
        await loadJson(importWrapper, tasks);
        // Mock the alert function
        const originalAlert = window.alert;
        window.alert = vitest.fn();
        await waitFor(() => expect(window.alert).toHaveBeenCalled());
        expect(JSON.stringify(importWrapper.vm.modelValue)).toEqual(JSON.stringify({ tasks: [] }));
        // Restore the original alert function
        window.alert = originalAlert
    });

    it('imports tasks fails: duplicated ids, expected no import', async () => {
        // first child missing 1 and name
        const tasks = {
            tasks: [
                {
                    id: '1',
                    name: 'Task 1',
                    status: TaskStatus.CREATED,
                    tasks: [{
                        id: '1',
                        name: 'Task 3',
                        status: TaskStatus.CREATED,
                        tasks: [],
                    }],
                },
                {
                    id: '2',
                    name: 'Task 2',
                    status: TaskStatus.DONE,
                    tasks: [],
                },
            ]
        };

        const emptyTasks: Task[] = [];
        const rootTask = reactive<RootTask>({ tasks: emptyTasks });
        const importWrapper = await mountSuspended(ImportTasks, {
            props: {
                modelValue: rootTask,
            },
        });
        await loadJson(importWrapper, tasks);
        // Mock the alert function
        const originalAlert = window.alert;
        window.alert = vitest.fn();
        await waitFor(() => expect(window.alert).toHaveBeenCalled());
        expect(JSON.stringify(importWrapper.vm.modelValue)).toEqual(JSON.stringify({ tasks: [] }));
        // Restore the original alert function
        window.alert = originalAlert
    });
});