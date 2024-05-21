<template>
    <AddTask @add-task="addTaskRoot" id="add-inline-root" v-if="!root.tasks.length" class="text-center">
        <v-icon :icon="mdiCursorDefaultClick" size="large"></v-icon> START CREATING NOW
    </AddTask>
    <v-list dense dark v-for="(subTask, index) in root.tasks">
        <TasksSubList v-model:task="root.tasks[index]" v-model:parent="root" :index="index" />
    </v-list>
</template>

<script setup lang="ts">
import type { TaskList } from '~/commons/Interfaces';
import { mdiCursorDefaultClick } from '@mdi/js';

const root = defineModel({ type: {} as PropType<TaskList>, required: true });

function addTaskRoot() {
    const newTask = createTask();
    root.value.tasks.push(newTask);
}

</script>