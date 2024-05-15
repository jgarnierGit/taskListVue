import { assert, describe, expect, it } from "vitest";
import { createWrapperWithData, getDirectComponentByTaskName, getTaskIdByName } from "./commons";
import TaskManager from "~/components/TaskManager.vue";

describe('TaskManager.vue status update', () => {
    it('renders status created', async () => {
        const taskName = '1';
        const wrapper = await createWrapperWithData();
        const statusComp = await getDirectComponentByTaskName(wrapper, TaskManager, taskName);
        assert(!!statusComp);
        expect(statusComp.vm.isCompleted).toBeFalsy();
    });

    it('renders status done', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const statusComp = await getDirectComponentByTaskName(wrapper, TaskManager, taskName);
        assert(!!statusComp);
        expect(statusComp.vm.isCompleted).toBeTruthy();
    });

    it('renders new status should be created', async () => {
        const taskName = '1';
        const taskId = getTaskIdByName(taskName);
        const wrapper = await createWrapperWithData();
        const addInlineComp = wrapper.find('#add-inline-before-' + taskId);
        assert(!!addInlineComp);
        await addInlineComp.trigger('click');

        const statusComp = await getDirectComponentByTaskName(wrapper, TaskManager, "New task");
        assert(!!statusComp);
        expect(statusComp.vm.isCompleted).toBeFalsy();
    });
});

describe('TaskManager.vue edit name', () => {
    it('Edit name of leaft Task, expecting name is edited', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        const editNameComp = getDirectComponentByTaskName(wrapper, TaskManager, taskName);
        const editField = wrapper.findComponent('[data-testid="edit-task-name"]');
        editField.trigger('click');
        editField.setValue('Toto');
        editField.trigger('blur');
        const taskComponents = wrapper.findAllComponents(TaskManager);
        const taskEdited = taskComponents.find((t) => t.props('task').id === taskId);
        assert(!!taskEdited);
        // FIXME value not persisted in test context when using v-text-field with input field test is valid
        expect(taskEdited.props('task').name).toEqual('Toto');
    });
});
