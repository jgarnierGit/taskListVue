// @vitest-environment nuxt
import { assert, describe, expect, it } from 'vitest';

import TasksList from '@/components/TasksList.vue';
import { type RootTask } from '~/types/Interfaces';
import TaskManager from '~/components/TaskManager.vue';
import { createWrapperWithData, getDirectComponentByTaskId, getDirectComponentByTaskName, getIdsOrder, getTaskIdByName, getTaskIndexByName as getTaskFlatIndexByName, createWrapperEmpty } from './commons';
import AddTask from '~/components/actions/AddTask.vue';

describe('TasksList.vue', () => {
    describe('Rendering recursive list', () => {

        it('renders empty', async () => {
            const wrapper = await createWrapperEmpty();

            const subtaskComponents = wrapper.findAllComponents(TaskManager);
            expect(subtaskComponents).toHaveLength(0);
        });

        it('renders subtasks correctly', async () => {
            const subTaskIds = getIdsOrder();

            const wrapper = await createWrapperWithData();
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

    describe('Adding new tasks', () => {
        it('add first on empty list', async () => {
            const wrapper = await createWrapperEmpty();
            const addInlineComp = wrapper.find('#add-inline-root');
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(1);
        });
        it('add task first position at root level', async () => {
            const taskName = '1';
            const taskId = getTaskIdByName(taskName);
            const wrapper = await createWrapperWithData();
            const addInlineComp = wrapper.find('#add-inline-before-' + taskId);
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(6);
            // expecting first task to be moved
            const newIndex = getTaskFlatIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(1);
        });

        it('add task after target at root level', async () => {
            const taskName = '1';
            const taskId = getTaskIdByName(taskName);
            const wrapper = await createWrapperWithData();
            const addInlineComp = wrapper.find('#add-inline-after-' + taskId);
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(6);
            // expecting last task to be moved
            const newIndex = getTaskFlatIndexByName(wrapper, '2');
            expect(newIndex).toEqual(5);
        });

        it('add task last position at root level', async () => {
            const task: RootTask = {
                tasks: []
            };
            const taskName = '2';
            const taskId = getTaskIdByName(taskName);
            const wrapper = await createWrapperWithData();
            const addInlineComp = wrapper.find('#add-inline-after-' + taskId);
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(6);
            // expecting last task to be still
            const newIndex = getTaskFlatIndexByName(wrapper, '2');
            expect(newIndex).toEqual(4);
        });

        it('add child task over leaf Task', async () => {
            const taskName = '2';
            const wrapper = await createWrapperWithData();
            const taskId = getTaskIdByName(taskName);
            const addInlineComp = getDirectComponentByTaskId(wrapper, AddTask, taskId);
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(6);
            // expecting last task to be still
            const newIndex = getTaskFlatIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(4);
            // task 2 must have 1 child
            const taskComp = getDirectComponentByTaskName(wrapper, TaskManager, taskName);
            expect(taskComp.props('task').tasks).toHaveLength(1);
        });

        it('add child task in first position', async () => {
            const taskName = '1';
            const wrapper = await createWrapperWithData();
            // open child list
            const firstComp = getDirectComponentByTaskName(wrapper, TaskManager, taskName);
            assert(!!firstComp);
            await firstComp.trigger('click');
            // add child
            const taskChildName = '1.1';
            const taskChildId = getTaskIdByName(taskChildName);
            const addInlineComp = wrapper.find('#add-inline-before-' + taskChildId);
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(6);
            // expecting first child to be moved
            const newIndex = getTaskFlatIndexByName(wrapper, taskChildName);
            expect(newIndex).toEqual(2);
            // task 1 must have 3 direct childs
            const taskComp = getDirectComponentByTaskName(wrapper, TaskManager, taskName);
            expect(taskComp.props('task').tasks).toHaveLength(3);
        });

        it('add child task in last position', async () => {
            const taskName = '1';
            const wrapper = await createWrapperWithData();
            // open child list
            const firstComp = getDirectComponentByTaskName(wrapper, TaskManager, taskName);
            assert(!!firstComp);
            await firstComp.trigger('click');
            // add child
            const taskChildName = '1.2';
            const taskChildId = getTaskIdByName(taskChildName);
            const addInlineComp = wrapper.find('#add-inline-after-' + taskChildId);
            assert(!!addInlineComp);
            await addInlineComp.trigger('click');

            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(6);
            // expecting last child to be still
            const newIndex = getTaskFlatIndexByName(wrapper, taskChildName);
            expect(newIndex).toEqual(2);
            // task 1 must have 3 direct childs
            const taskComp = getDirectComponentByTaskName(wrapper, TaskManager, taskName);
            expect(taskComp.props('task').tasks).toHaveLength(3);
        });
    });
});
