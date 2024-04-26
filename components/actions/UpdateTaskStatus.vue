<template>
    <div>
        <span v-if="isCompleted">Undone</span>
        <span v-if="!isCompleted">Complete</span>
    </div>
</template>

<script setup lang="ts">
/**
 * UpdateTaskStatus Component
 * @description Update task status to Created / Done
 * 
 */

import { ref } from 'vue';
const isCompleted = ref(false);


</script>