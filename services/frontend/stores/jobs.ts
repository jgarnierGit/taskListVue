import axios from 'axios';
import { defineStore } from 'pinia'
import type { JobResultType } from '~/commons/Interfaces';
import { API_BASE_URL } from '~/commons/const';

// store 1 job at a time
export const useJobsStore = defineStore('jobs', () => {
    const jobResult = ref<JobResultType>();
    const jobRunning = ref<string>();

    const hasJobResultData = computed(() => !!jobResult.value);
    const isJobRunning = computed(() => jobRunning.value);

    /**
     * Wait for a job to "SUCCESS", and save result in jobResult
     * @param id 
     * @param retry 
     * @param timeout 
     * @returns 
     */
    async function waitForJobResult(id: string, retry: number = 10, timeout: number = 1000) {
        if (!jobRunning.value) {
            jobRunning.value = id;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/job/${id}`);


            const { status, data } = response;
            if ((status < 200 || status > 299) || !data) {
                console.error(response);
                jobResult.value = { status: 'ERROR', data: undefined };
                jobRunning.value = undefined;
                return;
            }
            if (data.task_status === 'PENDING') {
                if (!retry) {
                    console.warn(`no more retry for job ${id}`)
                    jobResult.value = { status: 'RETRY_ENDS', data: undefined };
                    return;
                }
                setTimeout(() => waitForJobResult(id, retry - 1, timeout), timeout || 1000);
            }
            else if (data.task_status === 'SUCCESS') {
                jobResult.value = { status: 'SUCCESS', data: data.task_result };
                jobRunning.value = undefined;
            }
        } catch (e) {
            console.error(e);
            jobResult.value = { status: 'ERROR', data: undefined };
            jobRunning.value = undefined;
        }
    }

    function cancelJob() {
        if (jobRunning.value) {
            console.log(`TODO cancel job ${jobRunning.value}`);
        }
    }


    async function getJobResult(id: string) {
        jobRunning.value = id;
        const response = await axios.get(`${API_BASE_URL}/job/${id}`);
        const { status, data } = response;
        if (status < 200 && status > 299) {
            console.error(jobResult);
            jobResult.value = { status: 'ERROR', data: undefined };
        } else {
            jobResult.value = { status: 'SUCCESS', data: data.task_result };
        }
        jobRunning.value = undefined;
    }

    return { jobResult, jobRunning, isJobRunning, hasJobResultData, cancelJob, waitForJobResult, getJobResult }
});