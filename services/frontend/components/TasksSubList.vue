<template>
    <AddTask v-if="!index" :taskId="task.id" :id="`add-inline-before-${task.id}`" :label="`before ${task.name}`"
        @add-task="addTaskBefore" />
    <v-list-item v-if="!task.tasks.length && !isLazyLoaded">
        <template v-slot:prepend>
            <TaskMenu :task="task" :index="task.id" @up-order="orderingUp" @down-order="orderingDown"
                @delete="deleteTask" @status-update="updateStatus" />
        </template>
        <template v-slot:append>
            <AddTask :taskId="task.id" :label="`to ${task.name}`" :disabled="true">
                <v-btn density="compact" :id="`add-child-${task.id}`" @click="addTaskChild(task.id)" icon="$plus">
                </v-btn>
            </AddTask>
        </template>

        <TaskManager :task="task" />
    </v-list-item>

    <v-list-group v-else>
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <template v-slot:prepend>
                    <TaskMenu :task="task" :index="task.id" @up-order="orderingUp" @down-order="orderingDown"
                        @delete="deleteTask" @status-update="updateStatus" />
                </template>
                <template v-slot:append v-if="isLazyLoaded">
                    <v-btn density="compact" :id="`add-child-${task.id}`" @click="loadChild(task.id)" variant="plain"
                        :icon="lazyLoadIcon">
                    </v-btn>
                </template>
                <TaskManager :task="task" />

            </v-list-item>
        </template>
        <v-skeleton-loader type="list-item" v-if="isTaskLoading"></v-skeleton-loader>
        <v-list-item v-else v-for="(subt, subi) in task.tasks">
            <TasksSubList :task="subt" v-model:parent="task" :index="subi" @update-parent-status="updateParentStatus" />
        </v-list-item>
    </v-list-group>
    <AddTask :taskId="task.id" :id="`add-inline-after-${task.id}`" :label="`after ${task.name}`"
        @add-task="addTaskAfter" />
</template>

<script setup lang="ts">
/**
 * TasksList Component
 * @description manage recursive Tasks childs List:
 *  - a contextual editor menu for each Task
 *  - Task child list
 */
import axios from 'axios';
import type { LazyLoadedNode, Task, TaskList } from '~/commons/Interfaces';
import { API_BASE_URL } from '~/commons/const';

defineProps<{ index: number }>();
const parent = defineModel('parent', { type: {} as PropType<TaskList>, required: true });
const task = defineModel('task', { type: {} as PropType<Task>, required: true })
const emit = defineEmits(['updateParentStatus']);

const store = useLazyLoadingStore();
const isLazyLoaded = computed(() => store.isIdLazyLoaded(task.value.id));
const isTaskLoading = computed(() => store.isTaskLoading(task.value.id));
const lazyLoadIcon = computed(() => isTaskLoading.value ? "$chevronUp" : "$chevronDown")

function addTaskAfter(taskId: string) {
    const index = findTaskIndex(parent.value, taskId);
    const newTask = createTask();
    parent.value.tasks.splice(index + 1, 0, newTask);
}

function addTaskBefore(taskId: string) {
    const index = findTaskIndex(parent.value, taskId);
    const newTask = createTask();
    parent.value.tasks.splice(index, 0, newTask);
}

function addTaskChild(taskId: string) {
    const task = findTask(parent.value, taskId);
    const newTask = createTask();
    task.tasks.push(newTask);
}

function orderingUp(taskId: string) {
    const index = parent.value.tasks.findIndex((t) => t.id === taskId);
    if (index <= 0) {
        return;
    }
    const currentTask = parent.value.tasks[index];
    parent.value.tasks.splice(index, 1);
    parent.value.tasks.splice(index - 1, 0, currentTask)
}

function orderingDown(taskId: string) {
    const index = parent.value.tasks.findIndex((t) => t.id === taskId);
    if (index >= parent.value.tasks.length - 1) {
        return;
    }
    const currentTask = parent.value.tasks[index];
    parent.value.tasks.splice(index, 1);
    parent.value.tasks.splice(index + 1, 0, currentTask);
}

function deleteTask(taskId: string) {
    const index = findTaskIndex(parent.value, taskId);
    parent.value.tasks.splice(index, 1);
}

function updateStatus(taskId: string) {
    const task = findTask(parent.value, taskId);
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
    if (!(parent.value as Task).name) {
        return;
    }
    const areChildsDone = checkChildsStatusDone((parent.value as Task));
    if (areChildsDone && !((parent.value as Task).isDone)) {
        (parent.value as Task).isDone = true;
        emit('updateParentStatus');
    }
}

async function loadChild(taskId: string) {
    store.setIdLoading(taskId);
    try {
        const result = await axios.get(`${API_BASE_URL}/task/${taskId}/load`);
        if (!result || !result.data) {
            console.error("No result or no data, see server logs");
            alert(`Error while loading sub tasks of ${taskId}`);
            return;
        }
        const node = result.data as LazyLoadedNode;
        store.updateIdsLazyLoading(taskId, node.lazyLoadedIds);
        task.value.tasks = task.value.tasks.concat(node.tree.tasks);
    } catch (e) {
        console.error(e);
        alert(`Error while loading sub tasks of ${taskId}`);
    }
    finally {
        store.endIdLoading();
    }
}


</script>

<style>
/** reduce massive default indentation */
.v-list-group {
    --list-indent-size: 4px;
    --parent-padding: var(--indent-padding);
    --prepend-width: 4px;
}

.v-list-item {
    padding-right: 0px !important;
}

.v-list {
    padding-right: 16px;
}
</style>