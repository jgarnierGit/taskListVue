<template>
    <AddTask @add-task="addTaskRoot" id="add-inline-root" v-if="!root.tasks.length" />
    <v-list dense dark v-for="(subTask, index) in root.tasks">
        <TasksSubList v-model:task="root.tasks[index]" v-model:parent="root" :index="index" />
    </v-list>
</template>

<script setup lang="ts">
import type { TaskList } from '~/types/Interfaces';


const root = defineModel({ type: {} as PropType<TaskList>, required: true });

function addTaskRoot() {
    const newTask = createTask();
    root.value.tasks.push(newTask);
}

</script>