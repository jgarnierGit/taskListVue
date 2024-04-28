<template>
    <v-list dense dark v-for="(subTask, index) in taskchilds" :key="subTask.id">
        <AddInlineTask :taskId="subTask.id" @add-task="addTaskBefore" v-if="!index"
            :id="'add-inline-before-' + subTask.id" />
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
        <AddInlineTask v-else :taskId="subTask.id" @add-task="addTaskChild">
            <TaskManager :task="subTask">
                <TaskMenu :task="subTask" :index="subTask.id" :upOrderFn="orderingUp" :downOrderFn="orderingDown" />
            </TaskManager>
        </AddInlineTask>
        <AddInlineTask :taskId="subTask.id" @add-task="addTaskAfter" :id="'add-inline-after-' + subTask.id" />
    </v-list>
</template>

<script setup lang="ts">
/**
 * TasksList Component
 * @description manage recursive Tasks List:
 *  - a contextual editor menu for each Task
 *  - subLists
 */

import { TaskStatus, type ITask } from '~/Interfaces';
import AddInlineTask from './actions/AddInlineTask.vue';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{ task: ITask }>();

const taskchilds = ref(props.task.tasks);

function orderingUp(taskId: string) {
    const index = props.task.tasks.findIndex((t) => t.id === taskId);
    if (index <= 0) {
        return;
    }
    const prevTask = props.task.tasks[index - 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index - 1] = currentTask;
    props.task.tasks[index] = prevTask;
}

function orderingDown(taskId: string) {
    const index = props.task.tasks.findIndex((t) => t.id === taskId);
    if (index >= props.task.tasks.length - 1) {
        return;
    }
    const prevTask = props.task.tasks[index + 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index + 1] = currentTask;
    props.task.tasks[index] = prevTask;
}

function addTaskAfter(taskId: string) {
    const newTask = { id: uuidv4(), name: 'New task', tasks: [], status: TaskStatus.CREATED };
    const index = props.task.tasks.findIndex((t) => t.id === taskId);
    props.task.tasks.splice(index + 1, 0, newTask);
}

function addTaskBefore(taskId: string) {
    const newTask = { id: uuidv4(), name: 'New task', tasks: [], status: TaskStatus.CREATED };
    const index = props.task.tasks.findIndex((t) => t.id === taskId);
    props.task.tasks.splice(index, 0, newTask);
}

function addTaskChild(taskId: string) {
    // maybe a store is more suited....
    const newTask = { id: uuidv4(), name: 'New task', tasks: [], status: TaskStatus.CREATED };
    const task = props.task.tasks.find((t) => t.id === taskId);
    task?.tasks.push(newTask);
}
</script>