import { describe, expect, it } from "vitest";
import { createWrapperWithData, getDirectComponentByTaskId, getDirectComponentByTaskName, getTaskIdByName } from "../commons";
import TaskMenu from "~/components/TaskMenu.vue";
import DeleteTask from "~/components/actions/DeleteTask.vue";
import TaskManager from "~/components/TaskManager.vue";

describe('DeleteTask.vue', () => {
    it.todo('Remove single item', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-1 item
        expect(taskComponents).toHaveLength(4);
    });

    it.todo('Remove root task with childs', async () => {
        const taskName = '1';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-4 item
        expect(taskComponents).toHaveLength(1);
    });

    it.todo('Remove child task with no childs', async () => {
        const taskName = '1.1';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-1 item
        expect(taskComponents).toHaveLength(4);
    });

    it.todo('Remove child task with childs', async () => {
        const taskName = '1.2';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        // .... TODO write the logic to access delete button and click
        const taskComponents = wrapper.findAllComponents(TaskManager);
        // expect 5-2 item
        expect(taskComponents).toHaveLength(3);
    });
});