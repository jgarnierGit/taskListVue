<template>
    <v-file-input accept=".json" label="Import a tasks file description (JSON)" @change="importTasks"></v-file-input>
</template>

<script setup lang="ts">
import type { RootTask } from '~/Interfaces';
const emit = defineEmits(['replaceTree']);
/**
 * ImportTasks Component
 * @description JSON tasks importer
 * 
 */

function importTasks(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        alert('No file selected');
        return;
    }

    const maxSize = 1 * 1024 * 1024; // 1 MB

    if (file.size > maxSize) {
        console.log(`TODO process file server side, requires lazy loading`);
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        const importResult = parseTasks(result);

        if (importResult.success) {
            emit('replaceTree', importResult.taskTree);
        } else {
            alert(importResult.error);
        }
    };
    reader.onerror = (event) => {
        alert(`Error reading file: ${event.target?.error}`);
    };
    reader.readAsText(file);
}

function parseTasks(json: string): ImportResult {
    try {
        const taskTree = JSON.parse(json) as RootTask;
        return { success: true, taskTree };
    } catch (error) {
        return { success: false, error: 'Invalid JSON format' };
    }
}

interface ImportResult {
    success: boolean;
    taskTree?: RootTask;
    error?: string;
}
</script>