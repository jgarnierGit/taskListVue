<template>
    <v-file-input accept=".json" label="Import JSON" @change="importTasks">
    </v-file-input>
    <v-checkbox v-model="isDegraded">
        <v-tooltip activator="parent" location="top">Import with degraded performances</v-tooltip>
    </v-checkbox>
</template>

<script setup lang="ts">
/**
 * ImportTasks Component
 * @description JSON tasks importer
 * 
 */

import axios from 'axios';
import { z } from 'zod';
import { type LazyLoadedNode, type TaskList } from '~/commons/Interfaces';
import { API_BASE_URL } from '~/commons/const';
const root = defineModel<TaskList>({ required: true });
const isDegraded = ref(false);
// used for the unit tests, make sure to wait the content to be loaded.
const emit = defineEmits(['importedTasksList']);
const store = useLazyLoadingStore();

async function importTasks(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        alert('No file selected');
        return;
    }

    let importResult;

    const maxSize = 1 * 1024 * 1024; // 1 MB
    store.setIdLoading("ROOT");
    if (file.size > maxSize) {
        if (isDegraded.value) {
            importResult = await readServerSideDegraded(file);
        } else {
            importResult = await readServerSide(file);
        }
    }
    else {
        importResult = await readClientSide(file);
    }
    if (importResult) {
        replaceRoot(importResult);
        store.endIdLoading();
    }
}

async function readServerSide(file: File) {
    return await processServerSide(file, async (formData) => {
        // handcrafted watcher for job status
        const interceptor = axios.interceptors.response.use(function (r) {
            /** HTTP 2XX */
            const { data, config } = r;
            if (data && data.status === "pending") {
                // @ts-ignore
                if (!config.retry) {
                    return Promise.reject(r);
                }
                // @ts-ignore
                config.retry -= 1;
                const retryPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        console.log("retry the request", config.url);
                        resolve(r);
                    },
                        // @ts-ignore
                        config.retryDelay || 1000);
                });
                return retryPromise.then(() => axios(config));
            }
            return r;
        }, function (err) {
            /** HTTP > 2XX */
            return err;
        });

        const response = await axios.post(`${API_BASE_URL}/upload`, formData)
        try {
            // @ts-ignore , already an ugly hack waiting for a broker + task queue
            const jobResponse = await axios.get(`${API_BASE_URL}/job/${response.data.job_id}`, { retry: 50, retryDelay: 500 });
            if (!jobResponse.data || !jobResponse.data.result || jobResponse.data.status === "error") {
                alert(`Error while parsing file structure server side:  please refer to logs for further detail`);
                console.error(jobResponse?.data?.result);
                return
            }
            return jobResponse.data.result as LazyLoadedNode;
        } finally {
            axios.interceptors.response.eject(interceptor);
        }

    });
}

async function readServerSideDegraded(file: File) {
    return await processServerSide(file, async (formData) => {
        const response = await axios.post(`${API_BASE_URL}/uploadDegraded`, formData);
        if (!response.data) {
            alert(`Error while parsing file structure server side:  please refer to logs for further detail`);
            console.error(response);
            return
        }
        return response.data;
    });
}

async function processServerSide(file: File, callback: (formData: FormData) => Promise<LazyLoadedNode | undefined>) {
    const formData = new FormData()
    formData.append('file', file)
    try {
        const rootNode = await callback(formData);
        if (rootNode) {
            store.resetLazyLoadedIdsWith(rootNode.lazyLoadedIds);
            return rootNode.tree;
        }
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