import axios from 'axios';
import { defineStore } from 'pinia'
import { API_BASE_URL } from '~/commons/const';

export const useJobsStore = defineStore('jobs', () => {

    const jobResult = ref();
    const jobId = ref();

    const jobResultData = computed(() => jobResult.value);

    /**
     * Wait for a job to "SUCCESS", and save result in jobResult
     * @param id 
     * @param retry 
     * @param timeout 
     * @returns 
     */
    async function waitForJobResult(id: string, retry: number, timeout: number) {
        const response = await axios.get(`${API_BASE_URL}/job/${id}`);
        const { status, data } = response;
        if (status < 200 && status > 299) {
            return Promise.reject(response);
        }
        if (!data) {
            return Promise.reject(response);
        }
        if (data.task_status === 'PENDING') {
            if (!retry) {
                console.warn(`no more retry for job ${id}`)
                return Promise.reject(response);
            }
            setTimeout(() => waitForJobResult(id, retry - 1, timeout), timeout || 1000);
        }
        else if (data.task_status === 'SUCCESS') {
            jobResult.value = data.task_result;
        }
    }


    async function getJobResult(id: string) {
        const response = await axios.get(`${API_BASE_URL}/job/${id}`);
        const { status, data } = response;
        if (status < 200 && status > 299) {
            return Promise.reject(jobResult);
        }
        jobResult.value = data.task_result;
    }

    return { jobResult, jobId, jobResultData, waitForJobResult, getJobResult }
});