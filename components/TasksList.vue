<template>
    <AddTask @add-task="addTaskRoot" id="add-inline-root" v-if="!task.tasks.length" />
    <v-list dense dark v-for="(subTask, index) in task.tasks" :key="subTask.id">
        <AddTask :taskId="subTask.id" @add-task="addTaskBefore" v-if="!index" :id="`add-inline-before-${subTask.id}`" />
        <v-list-group v-if="!!subTask.tasks.length">
            <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                    <TaskManager :task="subTask">
                        <TaskMenu :task="subTask" :index="subTask.id" :upOrderFn="orderingUp"
                            :downOrderFn="orderingDown" :deleteFn="deleteTask" :updateFn="updateStatus" />
                    </TaskManager>
                </v-list-item>
            </template>
            <TasksList :task="subTask" @update-parent-status="updateParentStatus" />
        </v-list-group>
        <AddTask v-else :taskId="subTask.id" @add-task="addTaskChild">
            <!-- TODO add better labelling context like "Add Task inside/before/after {subTask.name}" -->
            <TaskManager :task="subTask">
                <TaskMenu :task="subTask" :index="subTask.id" :upOrderFn="orderingUp" :downOrderFn="orderingDown"
                    :deleteFn="deleteTask" :updateFn="updateStatus" />
            </TaskManager>
            <!-- REVIEW: TaskManager and TaskMenu could be implemented differently to prevent repetition and nesting in AddTask-->
            <!-- refactor the whole ui-->
        </AddTask>
        <AddTask :taskId="subTask.id" @add-task="addTaskAfter" :id="`add-inline-after-${subTask.id}`" />
    </v-list>
</template>

<script setup lang="ts">
/**
 * TasksList Component
 * @description manage recursive Tasks List:
 *  - a contextual editor menu for each Task
 *  - subLists
 */

import { type TaskList, type Task } from '~/types/Interfaces';
import AddTask from './actions/AddTask.vue';
import { v4 as uuidv4 } from 'uuid';


const props = defineProps<{ task: TaskList }>();

const emit = defineEmits(['updateParentStatus']);


function orderingUp(taskId: string) {
    const index = props.task.tasks.findIndex((t) => t.id === taskId); //REVIEW: this is repeated many times
    if (index <= 0) {
        return;
    }
    const prevTask = props.task.tasks[index - 1];
    const currentTask = props.task.tasks[index];
    props.task.tasks[index - 1] = currentTask;
    props.task.tasks[index] = prevTask;
    // TODO use splice.
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
    // TODO use splice.
}

function addTaskAfter(taskId: string) {
    const newTask = createTask();
    const index = props.task.tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
        throw new Error(`Task ${taskId} not found`);
    }

    props.task.tasks.splice(index + 1, 0, newTask);
}

function addTaskBefore(taskId: string) {
    const newTask = createTask();
    const index = props.task.tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
        throw new Error(`Task ${taskId} not found`);
    }

    props.task.tasks.splice(index, 0, newTask);
}

function addTaskChild(taskId: string) {
    const newTask = createTask();
    const task = props.task.tasks.find((t) => t.id === taskId);

    if (!task) {
        throw new Error(`Task ${taskId} not found`);
    }

    task.tasks.push(newTask);
}


function addTaskRoot() {
    const newTask = createTask();
    props.task.tasks.push(newTask);
}

function createTask() {
    return { id: uuidv4(), name: 'New task', tasks: [], isDone: false };
}

function deleteTask(taskId: string) {
    const index = props.task.tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
        throw new Error(`Task ${taskId} not found`);
    }
    props.task.tasks.splice(index, 1);
}


function updateStatus(taskId: string) {
    const task = props.task.tasks.find((t) => t.id === taskId);

    if (!task) {
        throw new Error(`Task ${taskId} not found`);
    }
    if (task.isDone) {
        task.isDone = false;
    }
    else {
        const areChildsDone = checkChildsStatusDone(task);
        if (!areChildsDone) {
            alert("NOT authorized");
            return;
        }
        task.isDone = true;
        updateParentStatus();
        emit('updateParentStatus');
    }
}

function checkChildsStatusDone(task: Task): Boolean {
    for (const subTask of task.tasks) {
        if (!subTask.isDone) {
            return false;
        }
        if (!!subTask.tasks.length) {
            checkChildsStatusDone(subTask);
        }
    }
    return true;
}

function updateParentStatus() {
    if (!(props.task as Task).name) {
        return;
    }
    const areChildsDone = checkChildsStatusDone((props.task as Task));
    if (areChildsDone && !((props.task as Task).isDone)) {
        (props.task as Task).isDone = true;
        emit('updateParentStatus');
    }
}

</script>