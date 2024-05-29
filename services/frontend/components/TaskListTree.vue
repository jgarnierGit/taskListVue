<template>
    <AddTask @add-task="addTaskRoot" id="add-inline-root" v-if="!root.tasks.length && !jobStore.isJobRunning"
        class="text-center">
        <v-icon :icon="mdiCursorDefaultClick"></v-icon>Start creation
    </AddTask>
    <v-container v-else-if="jobStore.isJobRunning" class="text-center">
        Loading tree...
    </v-container>
    <v-list dense dark v-for="(subTask, index) in root.tasks" :disabled="jobStore.isJobRunning">
        <TasksSubList v-model:task="root.tasks[index]" v-model:parent="root" :index="index" />
    </v-list>
</template>

<script setup lang="ts">
import type { TaskList } from '~/commons/Interfaces';
import { mdiCursorDefaultClick } from '@mdi/js';
const jobStore = useJobsStore();

const root = defineModel({ type: {} as PropType<TaskList>, required: true });

function addTaskRoot() {
    const newTask = createTask();
    root.value.tasks.push(newTask);
}

</script>