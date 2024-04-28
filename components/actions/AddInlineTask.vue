<template>
    <v-list-item @click="emitAddTask">
        <v-tooltip location="start center" origin="auto" text="Add Task" activator="parent" />
        <slot></slot>
    </v-list-item>
</template>

<script setup lang="ts">
/**
 * AddInlineTask Component
 * @description Add a new Task at the specified position.
 * 
 */
const props = defineProps<{ taskId: string }>();
const emit = defineEmits(['addTask']);

function emitAddTask() {
    emit('addTask', props.taskId);
}

</script>