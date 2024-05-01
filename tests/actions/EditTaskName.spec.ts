// @vitest-environment nuxt

import { assert, describe, expect, it } from "vitest";
import { createWrapperWithData, createWrapperWithTask, getDirectComponentByTaskName, getTaskIdByName } from "../commons";
import EditTaskName from "~/components/actions/EditTaskName.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { TaskStatus, type Task } from "~/Interfaces";
import TaskManager from "~/components/TaskManager.vue";

describe('DeleteTask.vue', () => {
    it('Edit name of leaft Task, expecting name is edited', async () => {
        const taskName = '2';
        const wrapper = await createWrapperWithData();
        const taskId = getTaskIdByName(taskName);
        const editNameComp = getDirectComponentByTaskName(wrapper, EditTaskName, taskName);
        const editField = editNameComp.find('input[type="text"]');
        editField.trigger('click');
        editField.setValue('Toto');
        editField.trigger('blur');
        const taskComponents = wrapper.findAllComponents(TaskManager);
        const taskEdited = taskComponents.find((t) => t.props('task').id === taskId);
        assert(!!taskEdited);
        // FIXME value not persisted in test context
        expect(taskEdited.props('task').name).toEqual('Toto');
    });
});