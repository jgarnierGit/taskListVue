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

import { TaskStatus, type Task } from '~/Interfaces';
const props = defineProps<{ task: Task }>();
const isCompleted = computed(() => props.task.status === TaskStatus.DONE);
</script>