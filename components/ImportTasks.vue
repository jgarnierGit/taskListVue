<template>
    <v-file-input accept=".json" label="Import a tasks file description (JSON)" @change="importTasks"></v-file-input>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { type TaskList } from '~/types/Interfaces';
const root = defineModel<TaskList>({ required: true });
// used for the unit tests, make sure to wait the content to be loaded.
const emit = defineEmits(['importedTasksList']);
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
        alert(`File too large, need server file loading, and requires lazy loading`);
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        const importResult = parseTasks(result);

        if (importResult) {
            replaceRoot(importResult);
        }
    };
    reader.onerror = (event) => {
        alert(`Error reading file: ${event.target?.error}`);
    };
    reader.readAsText(file);
}

function parseTasks(json: string) {
    // redundante with interface declaration, but I prefer to keep zod dedicated only for the parsing task.
    const task = z.object({
        id: z.string(),
        name: z.string(),
        isDone: z.boolean(),
        tasks: z.object({}).array().optional()
    });
    type TaskType = z.infer<typeof task & { tasks: TaskType[] }>;
    const taskSchema: z.ZodType<TaskType> = task.extend({
        tasks: z.lazy(() => task.array()),
    });
    const RootTaskSchema = z.object({ tasks: z.array(taskSchema) });
    try {
        const parseData = JSON.parse(json);
        return RootTaskSchema.parse(parseData) as TaskList;
    } catch (e) {
        console.error(e);
        alert("Error while parsing file structure, please refer to logs for further detail");
    }

}

function replaceRoot(newTree: TaskList) {
    root.value.tasks = newTree.tasks;
    emit('importedTasksList');
}

</script>