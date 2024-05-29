export const useSnackbarStore = defineStore('snackbar', () => {
    const content = ref<string>();
    const timeout = ref<number>();
    const type = ref<string>();

    function setContent(newContent: string, newTimeout?: number, newType?: string) {
        console.log(`content snackbar updated ${newContent}`)
        content.value = newContent;
        timeout.value = newTimeout;
        type.value = newType;
    }

    return { content, timeout, type, setContent }
})