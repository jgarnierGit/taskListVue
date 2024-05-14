<template>
    <v-file-input accept=".json" label="Import a tasks file description (JSON)" @change="importTasks"></v-file-input>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { type RootTask } from '~/types/Interfaces';
const rootTask = defineModel<RootTask>({ required: true });
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

        if (importResult.success) {
            if (importResult.taskTree) {
                replaceRoot(importResult.taskTree);
            }
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
    const task = z.object({ id: z.string(), name: z.string(), isDone: z.boolean(), tasks: z.object({}).array().optional() });
    type TaskType = z.infer<typeof task & { tasks: TaskType[] }>;
    const taskSchema: z.ZodType<TaskType> = task.extend({
        tasks: z.lazy(() => task.array()),
    });
    const RootTaskSchema = z.object({ tasks: z.array(taskSchema) });
    type RootTaskType = z.infer<typeof RootTaskSchema>;
    const rootTaskFromString = (content: string): RootTaskType => {
        return z.string().transform((_, ctx) => {
            try {
                return JSON.parse(content);
            } catch (error) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'invalid json'
                });
                return z.never;
            }
        }).pipe(RootTaskSchema).parse(content);
    }
    try {
        const taskTree = rootTaskFromString(json);
        return { success: true, taskTree: taskTree as RootTask };
    } catch (error) {
        return { success: false, error: 'Invalid JSON format' };
    }
}

function replaceRoot(newTree: RootTask) {
    rootTask.value.tasks = newTree.tasks;
    emit('importedTasksList');
}

interface ImportResult {
    success: boolean;
    taskTree?: RootTask;
    error?: string;
}
</script>