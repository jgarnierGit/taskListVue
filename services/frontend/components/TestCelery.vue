<template>
    <button type="button" @click="getAsync">load data</button><br />
    {{ jobId }}<br /> <button v-if="jobId" type="button" @click="waitResult">refresh</button>
    <v-card v-if="loaded" subtitle="This is a card subtitle" title="This is a title" class="mx-auto" width="600">{{
        store.jobResultData }}</v-card>
    <v-skeleton-loader v-else-if="loading" type="card" class="mx-auto" width="600"></v-skeleton-loader>
</template>
<script setup lang="ts">
import axios from 'axios';
import { API_BASE_URL } from '~/commons/const';
const store = useJobsStore();
const loaded = ref(false);
const loading = ref(false);
const jobId = ref();

watch(jobId, async (newValue) => {
    if (newValue) {
        store.waitForJobResult(newValue, 20, 500);
    }
})

async function getAsync() {
    loaded.value = false;
    loading.value = true;
    const jobIdResult = await axios.get(`${API_BASE_URL}/testCelery`);
    jobId.value = jobIdResult.data.job_id;
    loaded.value = true;
    loading.value = false;
}

async function waitResult() {
    store.getJobResult(jobId.value);
}
</script>