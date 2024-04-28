<template>
    <AddTask @add-task="addTaskRoot" id="add-inline-root" v-if="!taskchilds.length" />
    <v-list dense dark v-for="(subTask, index) in taskchilds" :key="subTask.id">
        <AddTask :taskId="subTask.id" @add-task-to="addTaskBefore" v-if="!index"
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
        <AddTask v-else :taskId="subTask.id" @add-task-to="addTaskChild">
            <TaskManager :task="subTask">
                <TaskMenu :task="subTask" :index="subTask.id" :upOrderFn="orderingUp" :downOrderFn="orderingDown" />
            </TaskManager>
        </AddTask>
        <AddTask :taskId="subTask.id" @add-task-to="addTaskAfter" :id="'add-inline-after-' + subTask.id" />
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
import AddTask from './actions/AddTask.vue';
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

    if (index === -1) {
        throw new Error(`Task ${taskId} not found`);
    }
    props.task.tasks.splice(index + 1, 0, newTask);
}

function addTaskBefore(taskId: string) {
    const newTask = { id: uuidv4(), name: 'New task', tasks: [], status: TaskStatus.CREATED };
    const index = props.task.tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
        throw new Error(`Task ${taskId} not found`);
    }
    props.task.tasks.splice(index, 0, newTask);
}

function addTaskChild(taskId: string) {
    const newTask = { id: uuidv4(), name: 'New task', tasks: [], status: TaskStatus.CREATED };
    const task = props.task.tasks.find((t) => t.id === taskId);

    if (!task) {
        throw new Error(`Task ${taskId} not found`);
    }
    task?.tasks.push(newTask);
}

function addTaskRoot() {
    const newTask = { id: uuidv4(), name: 'New task', tasks: [], status: TaskStatus.CREATED };
    props.task.tasks.push(newTask);
}
</script>