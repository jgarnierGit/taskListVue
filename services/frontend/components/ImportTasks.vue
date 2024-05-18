<template>
    <v-file-input accept=".json" label="Import a tasks file description (JSON)" @change="importTasks"></v-file-input>
</template>

<script setup lang="ts">
/**
 * ImportTasks Component
 * @description JSON tasks importer
 * 
 */

import axios from 'axios';
import { z } from 'zod';
import { type TaskList } from '~/types/Interfaces';
const root = defineModel<TaskList>({ required: true });
// used for the unit tests, make sure to wait the content to be loaded.
const emit = defineEmits(['importedTasksList']);

const API_BASE_URL = 'http://localhost:5000';

async function importTasks(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        alert('No file selected');
        return;
    }

    let importResult;

    const maxSize = 1 * 1024 * 1024; // 1 MB

    if (file.size > maxSize) {
        importResult = await readServerSide(file);
    }
    else {
        importResult = await readClientSide(file);
    }
    if (importResult) {
        replaceRoot(importResult);
    }
}

async function readServerSide(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData)
        return response.data as TaskList;
    } catch (e: any) {
        console.error(e);
        alert(`Error while parsing file structure server side:  please refer to logs for further detail`);
    }
}

async function readClientSide(file: File): Promise<TaskList | undefined> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            const result = event.target?.result as string;
            resolve(parseTasks(result));
        };
        reader.onerror = (event) => {
            alert(`Error reading file: ${event.target?.error}`);
            reject();
        };
        reader.readAsText(file);
    });
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