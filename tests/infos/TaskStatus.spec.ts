import { assert, describe, expect, it } from "vitest";
import { createWrapperWithData, getDirectComponentByTaskName, getTaskIdByName } from "../commons";
import TasksList from "~/components/TasksList.vue";
import TaskStatus from "~/components/infos/TaskStatus.vue";

describe('TaskStatus.vue', () => {
    it('renders status created', async () => {
        const taskName = '1';
        const wrapper = await createWrapperWithData();
        const statusComp = await getDirectComponentByTaskName(wrapper, TaskStatus, taskName);
        assert(!!statusComp);
        expect(statusComp.vm.isCompleted).toBeFalsy();
    });

    it('renders status done', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const statusComp = await getDirectComponentByTaskName(wrapper, TaskStatus, taskName);
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

        const statusComp = await getDirectComponentByTaskName(wrapper, TaskStatus, "New task");
        assert(!!statusComp);
        expect(statusComp.vm.isCompleted).toBeFalsy();
    });
});
