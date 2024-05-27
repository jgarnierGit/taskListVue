// @vitest-environment nuxt
import { describe, expect, it } from 'vitest';

import TaskManager from '~/components/TaskManager.vue';
import { createWrapperWithData, getIdsOrder, createWrapperEmpty } from './commons';

describe('TasksSubList.vue', () => {
    describe('Rendering recursive list', () => {

        it('renders empty', async () => {
            const wrapper = await createWrapperEmpty();

            const subtaskComponents = wrapper.findAllComponents(TaskManager);
            expect(subtaskComponents).toHaveLength(0);
        });

        it('renders subtasks correctly', async () => {
            const subTaskIds = getIdsOrder();

            const wrapper = await createWrapperWithData();
            // expecting 5 tasks
            const taskComponents = wrapper.findAllComponents(TaskManager);
            expect(taskComponents).toHaveLength(5);
            // checking ids order
            taskComponents.forEach((subtaskComponent, index) => {
                expect(subtaskComponent.props('task')).property('id').equal(subTaskIds[index]);
            });
        });
    });
});
