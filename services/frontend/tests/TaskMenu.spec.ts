import { assert, describe, expect, it } from "vitest";
import { createWrapperWithData, getDirectComponentByTaskName, getTaskIdByName, getTaskIndexByName } from "./commons";
import TaskManager from "~/components/TaskManager.vue";
import TaskMenu from "~/components/TaskMenu.vue";

describe('TaskMenu.vue, delete', () => {
    it('Remove single item', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-1 item
        expect(taskComponents).toHaveLength(4);
    });

    it('Remove root task with childs', async () => {
        const taskName = '1';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-4 item
        expect(taskComponents).toHaveLength(1);
    });

    it('Remove child task with no childs', async () => {
        const taskName = '1.1';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-1 item
        expect(taskComponents).toHaveLength(4);
    });

    it('Remove child task with childs', async () => {
        const taskName = '1.2';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-2 item
        expect(taskComponents).toHaveLength(3);
    });
});


describe('TaskMenu.vue, reorder', () => {

    async function getComponentByTaskName(wrapper: any, component: any, name: string) {
        // FIXME trigger menu before getting ReorderTask
        const taskMenu = await getDirectComponentByTaskName(wrapper, TaskMenu, name);
        const taskId = getTaskIdByName(name);
        const menu = taskMenu.find('#menu-activator-' + taskId);
        // await menu.trigger('click');
        //await menu.vm.$emit('click')
        // await menu.getCurrentComponent().ctx.$emit('click');
        // nextTick();
        // FIXME not enought to load menu content
        const subComponents = wrapper.findAllComponents(component);
        return subComponents.find((subComp: any) => subComp.props('task').name === name);
    }

    async function clickUpButton(comp: any) {
        const button = comp.find("#up-reorder");
        await button.trigger('click');
    }

    async function clickDownButton(comp: any) {
        const button = comp.find("#down-reorder");
        await button.trigger('click');
    }


    describe('interact with main list', () => {
        it('moving first up : does nothing', async () => {
            const taskName = '1';
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!firstTaskReorderComp);
            await clickUpButton(firstTaskReorderComp);
            expect(firstTaskReorderComp.emitted().upOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(0);
        });

        it('moving last down : does nothing', async () => {
            const taskName = '2';
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!lastTaskReorderComp);
            await clickDownButton(lastTaskReorderComp);
            expect(lastTaskReorderComp.emitted().downOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(4);
        });

        it('moving first down : goes down', async () => {
            const taskName = '1';
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!firstTaskReorderComp);
            await clickDownButton(firstTaskReorderComp);
            expect(firstTaskReorderComp.emitted().downOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(1);
        });

        it('moving last up : goes up', async () => {
            const taskName = '2';
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!lastTaskReorderComp);
            await clickUpButton(lastTaskReorderComp);
            expect(lastTaskReorderComp.emitted().upOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(0);
        });
    });

    describe('interact with sub-list', () => {
        it('moving sublist first up : does nothing', async () => {
            const taskName = '1.1';
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!firstTaskReorderComp);
            await clickUpButton(firstTaskReorderComp);
            expect(firstTaskReorderComp.emitted().upOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(1);
        });

        it('moving sublist last down : does nothing', async () => {
            const taskName = '1.2';
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!lastTaskReorderComp);
            await clickDownButton(lastTaskReorderComp);
            expect(lastTaskReorderComp.emitted().downOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(2);
        });

        it('moving sublist first down : goes down', async () => {
            const taskName = '1.1';
            const wrapper = await createWrapperWithData();
            const firstTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!firstTaskReorderComp);
            await clickDownButton(firstTaskReorderComp);
            expect(firstTaskReorderComp.emitted().downOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(3);
        });

        it('moving sublist last up : goes up', async () => {
            const taskName = '1.2';
            const wrapper = await createWrapperWithData();
            const lastTaskReorderComp = await getComponentByTaskName(wrapper, TaskMenu, taskName);
            assert(!!lastTaskReorderComp);
            await clickUpButton(lastTaskReorderComp);
            expect(lastTaskReorderComp.emitted().upOrder).toBeDefined();
            const newIndex = getTaskIndexByName(wrapper, taskName);
            expect(newIndex).toEqual(1);
        });

    });
});