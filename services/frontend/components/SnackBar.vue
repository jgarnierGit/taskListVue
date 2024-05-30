<template>
    <v-snackbar v-model="isOpen" :timeout="timeout" :color="type" elevation="24">
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
const { isOpen, content, timeout, type } = storeToRefs(store);

</script>