<template>
    <v-btn density="compact" id="export-tasks" @click="exportTasks"><v-icon>$download
        </v-icon>Export Tasks</v-btn>
</template>

<script setup lang="ts">
import type { ITask } from '~/Interfaces';

/**
 * ExportTasks Component
 * @description JSON tasks exporter
 * 
 */
const props = defineProps<{ task: ITask }>();

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