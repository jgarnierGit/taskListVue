import axios from 'axios';
import { defineStore } from 'pinia'
import type { JobResultType } from '~/commons/Interfaces';
import { API_BASE_URL, SNACKBAR_TIMEOUT } from '~/commons/const';
import { useSnackbarStore } from './snackbar'

// store 1 job at a time
export const useJobsStore = defineStore('jobs', () => {
    const snackbar = useSnackbarStore();
    const jobResult = ref<JobResultType>();
    const jobRunningId = ref<string>();

    const jobCallback = ref();

    const hasJobResultData = computed(() => !!jobResult.value);
    const isJobRunning = computed(() => !!jobRunningId.value);


    /**
     * Wait for a job to "SUCCESS", and save result in jobResult
     * @param id 
     * @param retry 
     * @param timeout 
     * @param callback to handle each possible result state ['SUCCESS', 'ERROR', 'RETRY_ENDS'] 
     * @returns 
     */
    async function waitForJobResult(id: string, retry: number = 10, timeout: number = 1000, callback?: Function) {
        if (!jobRunningId.value) {
            jobRunningId.value = id;
            jobCallback.value = callback;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/job/${id}`);

            const { status, data } = response;
            if ((status < 200 || status > 299) || !data) {
                console.error(response);
                jobResult.value = { status: 'ERROR', data: undefined };
                if (jobCallback.value) {
                    jobCallback.value(jobResult.value);
                    jobCallback.value = undefined;
                }
                jobRunningId.value = undefined;
                return;
            }
            else if (data.task_status === 'PENDING') {
                if (!retry) {
                    console.warn(`no more retry for job ${id}`)
                    jobResult.value = { status: 'RETRY_ENDS', data: undefined };
                    if (jobCallback.value) {
                        jobCallback.value(jobResult.value);
                    }
                    return;
                }
                console.log(`fetch job ${id} `)
                setTimeout(() => waitForJobResult(id, retry - 1, timeout), timeout || 1000, callback);
            }
            else if (data.task_status === 'SUCCESS') {
                jobResult.value = { status: 'SUCCESS', data: data.task_result };
                if (jobCallback.value) {
                    jobCallback.value(jobResult.value);
                    jobCallback.value = undefined;
                }
                jobRunningId.value = undefined;
            }
        } catch (e) {
            console.error(e);
            jobResult.value = { status: 'ERROR', data: undefined };
            if (jobCallback.value) {
                jobCallback.value(jobResult.value);
            }
            jobRunningId.value = undefined;
        }
    }

    async function cancelJob(jobId: string) {
        if (jobRunningId.value && jobRunningId.value === jobId) {
            await axios.delete(`${API_BASE_URL}/job/${jobId}`);
            jobRunningId.value = undefined;
            jobCallback.value = undefined;
            jobResult.value = undefined;
        }
    }


    async function getJobResult(id: string) {
        if (!jobRunningId.value) {
            jobRunningId.value = id;
        } else if (jobRunningId.value !== id) {
            snackbar.setContent("Another job still pending", SNACKBAR_TIMEOUT, "warning");
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/job/${id}`);
            const { status, data } = response;
            if (status < 200 || status > 299) {
                console.error(jobResult);
                jobResult.value = { status: 'ERROR', data: undefined };
                if (jobCallback.value) {
                    jobCallback.value(jobResult.value);
                }
                jobRunningId.value = undefined;
            } else if (data.task_status === 'PENDING') {
                jobResult.value = { status: data.task_status, data: data.task_result };
                if (jobCallback.value) {
                    jobCallback.value(jobResult.value);
                }
            }
            else if (data.task_status === 'SUCCESS') {
                jobResult.value = { status: data.task_status, data: data.task_result };
                if (jobCallback.value) {
                    jobCallback.value(jobResult.value);
                    jobCallback.value = undefined;
                    jobRunningId.value = undefined;
                }
            }
        } catch (e) {
            console.error(e);
            jobResult.value = { status: 'ERROR', data: undefined };
            if (jobCallback.value) {
                jobCallback.value(jobResult.value);
                jobCallback.value = undefined;
            }
            jobRunningId.value = undefined;
        }
    }

    function reset() {
        jobRunningId.value = undefined;
        jobCallback.value = undefined;
        jobResult.value = undefined;
    }

    return { jobResult, jobRunningId, isJobRunning, hasJobResultData, cancelJob, waitForJobResult, getJobResult, reset }
});