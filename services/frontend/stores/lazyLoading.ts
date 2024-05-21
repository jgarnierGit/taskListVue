import { defineStore } from 'pinia'

export const useLazyLoadingStore = defineStore('lazyLoading', () => {
    // states
    const lazyLoadedIds = ref([] as string[]);
    const loadingId = ref<string>();

    // getters
    const isIdLazyLoaded: ComputedRef<(id: string) => boolean> = computed(() => (id: string) => !!lazyLoadedIds.value.find((idx) => idx === id));
    const isTaskLoading: ComputedRef<(id: string) => boolean> = computed(() => (id: string) => loadingId.value === id);
    const isLoadingRunning = computed(() => !!loadingId.value);

    // actions
    function resetLazyLoadedIdsWith(ids: string[]) {
        lazyLoadedIds.value = [];
        lazyLoadedIds.value = ids;
    }

    function setIdLoading(taskId: string) {
        loadingId.value = taskId;
    }

    function updateIdsLazyLoading(taskId: string, lazyLoadIds: string[]) {
        // remove current task node id from lazy-loaded list
        const idx = lazyLoadedIds.value.indexOf(taskId);
        if (idx === -1) {
            console.warn(`id ${taskId} is not lazy loaded `);
            return;
        }
        lazyLoadedIds.value.splice(idx, 1);
        // concat new list to current
        lazyLoadedIds.value = lazyLoadedIds.value.concat(lazyLoadIds);
    }

    function endIdLoading() {
        loadingId.value = undefined
    }

    return {
        endIdLoading,
        isIdLazyLoaded,
        isTaskLoading,
        isLoadingRunning,
        lazyLoadedIds,
        loadingId,
        resetLazyLoadedIdsWith,
        setIdLoading,
        updateIdsLazyLoading
    }
});