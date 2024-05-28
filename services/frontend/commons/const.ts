const API_BASE_URL = 'http://localhost:5000';

// @ts-ignore  defined in nuxt.config.ts
const JOB_RETRY_MAX = VUE_APP_JOB_RETRY_MAX;
// @ts-ignore  defined in nuxt.config.ts
const JOB_RETRY_TIMEOUT = VUE_APP_JOB_RETRY_TIMEOUT;

export { API_BASE_URL, JOB_RETRY_MAX, JOB_RETRY_TIMEOUT }