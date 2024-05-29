<template>
    <v-form @submit.prevent="generateTree">
        <v-row dense>
            <v-col cols="12">
                <div class="text-caption">Tasks quantity to generate at the root</div>
                <v-slider v-model="maxRootTask" prepend-icon="$mdiFileTreeOutline" :max="10" show-ticks="always"
                    step="1" tick-size="4" thumb-label></v-slider>
                <div class="text-caption">Max childs per task</div>
                <v-slider v-model="maxChildTask" prepend-icon="$mdiArrowExpandHorizontal" :max="10" show-ticks="always"
                    step="1" tick-size="4" thumb-label></v-slider>
                <div class="text-caption">Max depth tree</div>
                <v-slider v-model="maxTreeDepth" prepend-icon="$mdiArrowExpandVertical" :max="10" show-ticks="always"
                    step="1" tick-size="4" thumb-label></v-slider>
                <div class="text-caption">Task name maximum lenght</div>
                <v-slider v-model="maxNameLength" prepend-icon="$mdiFormTextbox" :max="25" show-ticks="always" step="1"
                    tick-size="4" thumb-label></v-slider>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" class="text-center">
                <v-btn class="me-4 text-center" type="submit">
                    submit
                </v-btn>
            </v-col>
        </v-row>

    </v-form>
</template>
<script setup lang="ts">
import axios from 'axios';
import type { JobResultType } from '~/commons/Interfaces';
import { API_BASE_URL, JOB_RETRY_MAX, JOB_RETRY_TIMEOUT, SNACKBAR_LONG_TIMEOUT, SNACKBAR_TIMEOUT } from '~/commons/const';

const store = useJobsStore();
const snackbarStore = useSnackbarStore();
const emit = defineEmits(['processing']);
const maxRootTask = ref();
const maxChildTask = ref();
const maxTreeDepth = ref();
const maxNameLength = ref();
const jobId = ref();

const callback = (result: JobResultType) => {
    if (result) {
        if (result.status === 'SUCCESS' && result.data) {
            snackbarStore.setContent(`File ${result.data} generated successfully`, SNACKBAR_LONG_TIMEOUT, "success");
        }
        if (result.status === 'RETRY_ENDS') {
            console.log("RETRY_ENDS");
            snackbarStore.setContent("Generating file is taking longer than expected, you can force refresh or check the logs", SNACKBAR_TIMEOUT, "warning");
        }
        if (result.status === 'ERROR') {
            snackbarStore.setContent("Error while generating JSON file, check the logs", SNACKBAR_TIMEOUT, "error");
        }
    }
}

async function generateTree() {
    try {
        const params = { max_depth: maxTreeDepth.value, max_child_per_task: maxChildTask.value, max_name_length: maxNameLength.value, total_root_task: maxRootTask.value };
        const response = await axios.post(`${API_BASE_URL}/generate`, params);
        jobId.value = response.data.job_id;
        store.waitForJobResult(response.data.job_id, JOB_RETRY_MAX, JOB_RETRY_TIMEOUT, callback);
        emit('processing', jobId.value);
    } catch (error) {
        console.error(error);
        alert(`Error while generating tree, read the logs`);
    }

}



</script>