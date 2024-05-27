import { assert, describe, expect, it } from "vitest";
import { createWrapperWithData, getDirectComponentByTaskName, getTaskIdByName } from "./commons";
import TaskManager from "~/components/TaskManager.vue";

describe('TaskManager.vue status update', () => {
    it('renders status created', async () => {
        const taskName = '1';
        const wrapper = await createWrapperWithData();
        const statusComp = await getDirectComponentByTaskName(wrapper, TaskManager, taskName);
        assert(!!statusComp);
        expect(statusComp.vm.task.isDone).toBeFalsy();
    });

    it('renders status done', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const statusComp = await getDirectComponentByTaskName(wrapper, TaskManager, taskName);
        assert(!!statusComp);
        expect(statusComp.vm.task.isDone).toBeTruthy();
    });
});

