<template>
    <div>
        status :
        <span :data-testid="`taskStatusDone-${task.id}`" v-if="isCompleted">Done</span>
        <span :data-testid="`taskStatusCreated-${task.id}`" v-if="!isCompleted">Created</span>
    </div>
</template>

<script setup lang="ts">
/**
 * TaskStatus Component
 * @description Show the task status
 * 
 */

import { type Task } from '~/types/Interfaces';
const props = defineProps<{ task: Task }>();
const isCompleted = computed(() => !!props.task.isDone);
</script>