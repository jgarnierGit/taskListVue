<template>
    <div>
        status :
        <span v-if="isCompleted">Done</span>
        <span v-if="!isCompleted">Created</span>
    </div>
</template>

<script setup lang="ts">
/**
 * TaskStatus Component
 * @description Show the task status
 * 
 */

import { ref } from 'vue';

const isCompleted = ref(true);
</script>