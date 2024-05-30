<template>
    <v-progress-linear indeterminate v-if="store.isLoadingRunning"></v-progress-linear>
    <v-card-text v-else>
        <v-row dense>
            <v-col cols="12">
                <v-file-input accept=".json" label="Import JSON" @change="importTasks"></v-file-input>
            </v-col>
        </v-row>
    </v-card-text>
    <v-card-text v-if="jobOutOfRetry">
        <v-alert icon="$mdiAlert" variant="outlined">
            <template v-slot:text>Job is taking longer than expected, you can refresh manually to wait for the
                result, or check if all server services are running.
            </template>
        </v-alert>
        <v-row dense>
            <v-col cols="12" class="text-center">
                <v-btn prepend-icon="$mdiRefresh" @click="waitResult">
                    Refresh
                </v-btn>
            </v-col>
        </v-row>
    </v-card-text>
</template>

<script setup lang="ts">
/**
 * ImportTasks Component
 * @description JSON tasks importer
 * 
 */

import axios from 'axios';
import { z } from 'zod';
import { type TaskList } from '~/commons/Interfaces';
import { API_BASE_URL, JOB_RETRY_MAX, JOB_RETRY_TIMEOUT, SNACKBAR_TIMEOUT } from '~/commons/const';
const root = defineModel<TaskList>({ required: true });
const emit = defineEmits(['afterImport', 'startUpload']);
const store = useLazyLoadingStore();
const snackbarStore = useSnackbarStore();
const jobStore = useJobsStore();
const jobId = ref();
const { jobResult } = storeToRefs(jobStore);
const jobOutOfRetry = ref(false);

watch(jobResult, (newValue) => {
    if (newValue) {
        if (newValue.status === 'SUCCESS' && newValue.data) {
            snackbarStore.setContent("Import done", SNACKBAR_TIMEOUT, "success");
            store.resetLazyLoadedIdsWith(newValue.data.lazyLoadedIds);
            jobStore.reset();
            replaceRoot(newValue.data.tree);
        }
        else if (newValue.status === 'RETRY_ENDS') {
            jobOutOfRetry.value = true;
        }
        else if (newValue.status === 'ERROR') {
            store.endIdLoading();
            snackbarStore.setContent("Error while importing JSON file, check the logs", SNACKBAR_TIMEOUT, "error");
        }
        else if (newValue.status === 'PENDING') {
            snackbarStore.setContent("Import still pending...", SNACKBAR_TIMEOUT, "info");
        }
    }
})

async function waitResult() {
    jobStore.getJobResult(jobId.value);
}


onUnmounted(() => {
    store.endIdLoading();
})

async function importTasks(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        snackbarStore.setContent("No file selected", SNACKBAR_TIMEOUT, "error");
        return;
    }

    let importResult;

    const maxSize = 1 * 1024 * 1024; // 1 MB
    store.setIdLoading("ROOT");
    try {
        if (file.size > maxSize) {
            emit('startUpload');
            await readServerSide(file);
        }
        else {
            importResult = await readClientSide(file);
        }
        if (importResult) {
            replaceRoot(importResult);

        }
    } catch (error) {
        console.error(error);
        store.endIdLoading();
        snackbarStore.setContent("Error while importing JSON file, check the logs", SNACKBAR_TIMEOUT, "error");
    }
}

async function readServerSide(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/upload`, formData);
    jobId.value = response.data.job_id;
    try {
        jobStore.waitForJobResult(jobId.value, JOB_RETRY_MAX, JOB_RETRY_TIMEOUT);
    } catch (error) {
        console.error(error);
        store.endIdLoading();
        snackbarStore.setContent("Error while importing JSON file, check the logs", SNACKBAR_TIMEOUT, "error");
    }
}

async function readClientSide(file: File): Promise<TaskList | undefined> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            const result = event.target?.result as string;
            try {
                const res = parseTasks(result);
                resolve(res);
            } catch (e) {
                reject(e);
                store.endIdLoading();
            }
        };
        reader.onerror = (event) => {
            snackbarStore.setContent("Error reading JSON file, check the logs", SNACKBAR_TIMEOUT, "error");
            console.error(event);
            reject();
        };
        reader.readAsText(file);
    });
}

function parseTasks(json: string) {
    const task = z.object({
        id: z.string(),
        name: z.string(),
        isDone: z.boolean(),
        tasks: z.object({}).array().default([])
    });
    type TaskType = z.infer<typeof task & { tasks: TaskType[] }>;
    const taskSchema: z.ZodType<TaskType> = task.extend({
        tasks: z.lazy(() => taskSchema.array()),
    });
    const RootTaskSchema = z.object({ tasks: z.array(taskSchema) });
    const parseData = JSON.parse(json);
    return RootTaskSchema.parse(parseData) as TaskList;
}

function replaceRoot(newTree: TaskList) {
    root.value.tasks = newTree.tasks;
    emit('afterImport');
}

</script>