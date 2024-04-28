<template>
    <v-list dense dark v-for="subTask in taskchilds" :key="subTask.id">
        <v-list-group v-if="!!subTask.tasks.length">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                    <TaskManager :task="subTask">
                        <TaskMenu :task="subTask" :index="subTask.id" :upOrderFn="orderingUp"
                            :downOrderFn="orderingDown" />
                    </TaskManager>
                </v-list-item>
            </template>
            <TasksList :task="subTask" />
        </v-list-group>
        <v-list-item v-else>
            <TaskManager :task="subTask">
                <TaskMenu :task="subTask" :index="subTask.id" :upOrderFn="orderingUp" :downOrderFn="orderingDown" />
            </TaskManager>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
/**
 * TasksList Component
 * @description manage recursive Tasks List:
 *  - a contextual editor menu for each Task
 *  - subLists
 */

import type { ITask } from '~/Interfaces';

const props = defineProps<{ task: ITask }>();

const taskchilds = ref(props.task.tasks);

function orderingUp(taskId: number) {
    const index = props.task.tasks.findIndex((t) => t.id === taskId);
    if (index <= 0) {
        return;
    }
    const prevTask = props.task.tasks[index - 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index - 1] = currentTask;
    props.task.tasks[index] = prevTask;
}

function orderingDown(taskId: number) {
    const index = props.task.tasks.findIndex((t) => t.id === taskId);
    if (index >= props.task.tasks.length - 1) {
        return;
    }
    const prevTask = props.task.tasks[index + 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index + 1] = currentTask;
    props.task.tasks[index] = prevTask;
}
</script>