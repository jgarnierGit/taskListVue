<template>
    <v-btn block id="export-tasks" @click="exportTasks" :disabled="isEmptyList">
        <v-icon>$download</v-icon>
        Export Tasks
    </v-btn>
</template>

<script setup lang="ts">
import type { TaskList } from '~/commons/Interfaces';

/**
 * ExportTasks Component
 * @description JSON tasks exporter
 * 
 */
const props = defineProps<{ task: TaskList }>();
const isEmptyList = computed(() => props.task.tasks.length === 0);

function exportTasks() {
    const json = JSON.stringify(props.task, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();
}
</script>