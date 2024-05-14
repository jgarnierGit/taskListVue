<template>
    <v-btn prepend-icon="$check" v-if="!isCompleted" id="complete-task" @click="emitStatusUpdate">
        Complete
    </v-btn>
    <v-btn prepend-icon="$autorenew" v-if="isCompleted" id="unvalidate-task" @click="emitStatusUpdate">
        Undone
    </v-btn>
</template>

<script setup lang="ts">
/**
 * UpdateTaskStatus Component
 * @description Update task status to Created / Done
 * 
 */
import { type Task } from '~/types/Interfaces';

const isCompleted = computed(() => {
    return !!props.task.isDone;
});
const props = defineProps<{ task: Task }>();
const emit = defineEmits(['statusUpdate']);

function emitStatusUpdate() {
    emit('statusUpdate', props.task.id);
}
</script>