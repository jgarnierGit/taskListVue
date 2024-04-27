<template>
    <TaskManager v-for="subTask in taskchilds" v-if="!!taskchilds.length" :task="subTask" :parentTask="task">
        <!-- ActionsMenu -->
        <div>
            <ReorderTask :task="subTask" @up-order="orderingUp" @down-order="orderingDown" />
            <UpdateTaskStatus />
            <DeleteTask />
        </div>
        <!-- subTask list -->
        <div v-if="!!subTask.tasks.length">
            sublisting {{ subTask.name }}
            <TasksList :task="subTask" />
        </div>
    </TaskManager>

</template>

<script setup lang="ts">
/**
 * TasksList Component
 * @description manage recursive Tasks List:
 *  - a contextual editor menu for each Task
 *  - subLists
 */

import type { ITask, Task } from '~/Interfaces';
import UpdateTaskStatus from './actions/UpdateTaskStatus.vue';
import ReorderTask from './actions/ReorderTask.vue';
import DeleteTask from './actions/DeleteTask.vue';

const props = defineProps<{ task: ITask }>();

const taskchilds = ref(props.task.tasks);

function orderingUp(task: Task) {
    const index = props.task.tasks.findIndex((t) => t.id === task.id); // TODO optimization : use index from v-for
    if (index <= 0) {
        return;
    }
    const prevTask = props.task.tasks[index - 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index - 1] = currentTask;
    props.task.tasks[index] = prevTask;
}

function orderingDown(task: Task) {
    const index = props.task.tasks.findIndex((t) => t.id === task.id); // TODO use index for v-for to optimize
    if (index >= props.task.tasks.length - 1) {
        return;
    }
    const prevTask = props.task.tasks[index + 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index + 1] = currentTask;
    props.task.tasks[index] = prevTask;
}

</script>