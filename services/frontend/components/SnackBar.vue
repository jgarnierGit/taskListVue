<template>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="type" elevation="24">
        {{ content }}

        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar = false">
                X
            </v-btn>
        </template>
    </v-snackbar>

</template>

<script setup lang="ts">
const store = useSnackbarStore();
const { content, timeout, type } = storeToRefs(store);
const snackbar = ref(false);

watch(content, (newVal) => {
    console.log(newVal)
    const timeoutToSet = timeout.value;
    if (snackbar.value) {
        timeout.value = 0;
        nextTick();
    }
    timeout.value = timeoutToSet;
    snackbar.value = true;
})



</script>