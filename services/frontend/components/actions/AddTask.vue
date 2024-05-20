<template>
    <v-list-item @click="emitAddTask" v-if="!disabled">
        <v-tooltip location="start center" origin="auto" :text="`Add task ${label}`" activator="parent" />
        <slot></slot>
    </v-list-item>
    <v-list-item v-else>
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
const props = withDefaults(defineProps<{ taskId?: string, label?: string, disabled?: boolean }>(), {
    label: () => ""
});
const emit = defineEmits(['addTask']);

function emitAddTask() {
    emit('addTask', props.taskId);
}

</script>