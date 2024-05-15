<template>
    <v-list-item @click="emitAddTask">
        <v-tooltip location="start center" origin="auto" :text="`Add task ${label}`" activator="parent" />
        <slot></slot>
    </v-list-item>
</template>

<script setup lang="ts">
/**
 * AddInlineTask Component
 * @description Add a new task at the specified position or at 0 position of the active sublist.
 * 
 */
const props = withDefaults(defineProps<{ taskId?: string, label?: string }>(), {
    label: () => ""
});
const emit = defineEmits(['addTask']);

function emitAddTask() {
    emit('addTask', props.taskId);
}

</script>