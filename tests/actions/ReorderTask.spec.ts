// @vitest-environment nuxt
import { assert, describe, expect, it, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import ReorderTask from '~/components/actions/ReorderTask.vue';
import { createWrapperWithData } from '../commons';
import TaskManager from '~/components/TaskManager.vue';
import type { Task } from '~/Interfaces';

describe('ReorderTask.vue', () => {

    function getComponentByTaskName(wrapper: any, component: any, name: string) {
        const subComponents = wrapper.findAllComponents(component);
        return subComponents.find((subComp: any) => subComp.props('task').name === name);
    }

    /**
     * get flat list index 
     * @param wrapper 
     * @param name 
     * @returns 
     */
    function getTaskIndexByName(wrapper: any, name: string): number {
        const subComponents = wrapper.findAllComponents(TaskManager);
        return subComponents.findIndex((taskComp: any) => taskComp.props('task').name === name);
    }



    describe('interact with main list', () => {
        it('moving first up : does nothing', async () => {
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '1');
            assert(!!firstTaskReorderComp);
            firstTaskReorderComp.vm.up();
            const newIndex = getTaskIndexByName(wrapper, '1');
            expect(newIndex).toEqual(0);
        });

        it('moving last down : does nothing', async () => {
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '2');
            assert(!!lastTaskReorderComp);
            lastTaskReorderComp.vm.down();
            const newIndex = getTaskIndexByName(wrapper, '2');
            expect(newIndex).toEqual(4);
        });

        it('moving first down : goes down', async () => {
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '1');
            assert(!!firstTaskReorderComp);
            firstTaskReorderComp.vm.down();
            const newIndex = getTaskIndexByName(wrapper, '1');
            expect(newIndex).toEqual(4);
        });

        it('moving last up : goes up', async () => {
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '2');
            assert(!!lastTaskReorderComp);
            lastTaskReorderComp.vm.up();
            const newIndex = getTaskIndexByName(wrapper, '2');
            expect(newIndex).toEqual(0);
        });
    });

    describe('interact with sub-list', () => {
        it('moving sublist first up : does nothing', async () => {
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '1.1');
            assert(!!firstTaskReorderComp);
            firstTaskReorderComp.vm.up();
            const newIndex = getTaskIndexByName(wrapper, '1');
            expect(newIndex).toEqual(1);
        });

        it('moving sublist last down : does nothing', async () => {
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '1.2');
            assert(!!lastTaskReorderComp);
            lastTaskReorderComp.vm.down();
            const newIndex = getTaskIndexByName(wrapper, '2');
            expect(newIndex).toEqual(2);
        });

        it('moving sublist first down : goes down', async () => {
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '1.1');
            assert(!!firstTaskReorderComp);
            firstTaskReorderComp.vm.down();
            const newIndex = getTaskIndexByName(wrapper, '1');
            expect(newIndex).toEqual(2);
        });

        it('moving sublist last up : goes up', async () => {
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = getComponentByTaskName(wrapper, ReorderTask, '1.2');
            assert(!!lastTaskReorderComp);
            lastTaskReorderComp.vm.up();
            const newIndex = getTaskIndexByName(wrapper, '2');
            expect(newIndex).toEqual(1);
        });

    });
});