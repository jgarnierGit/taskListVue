<template>
    <v-list-item @click="emitAddTask">
        <v-tooltip location="start center" origin="auto" text="Add Task" activator="parent" />
        <slot></slot>
    </v-list-item>
</template>

<script setup lang="ts">
/**
 * AddTask Component
 * @description Add a new task at the specified position or at 0 position of the active sublist.
 * 
 */
const props = defineProps<{ taskId?: string }>();
const emit = defineEmits(['addTask', 'addTaskTo']);

function emitAddTask() {
    if (props.taskId) {
        emit('addTaskTo', props.taskId);
    }
    else {
        emit('addTask');
    }

}

</script>