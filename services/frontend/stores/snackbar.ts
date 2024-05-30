export const useSnackbarStore = defineStore('snackbar', () => {
    const isOpen = ref(false);
    const content = ref<string>();
    const timeout = ref<number>();
    const type = ref<string>();

    function setContent(newContent: string, newTimeout?: number, newType?: string) {
        if (isOpen.value) {
            isOpen.value = false;
            nextTick();
        }
        content.value = newContent;
        timeout.value = newTimeout;
        type.value = newType;
        isOpen.value = true;
    }

    return { content, isOpen, timeout, type, setContent }
})