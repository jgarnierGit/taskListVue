<template>
    <v-btn density="compact" id="up-reorder" @click="emitUpOrder"><v-icon>$transferUp </v-icon></v-btn>
    <v-btn density="compact" id="down-reorder" @click="emitDownOrder"><v-icon>$transferDown</v-icon></v-btn>
</template>

<script setup lang="ts">
import type { Task } from '~/Interfaces';

/**
 * ReorderTask Component
 * @description Moves targeted task at the desired position of the current sublist.
 * 
 */
const props = defineProps<{ task: Task }>();
const emit = defineEmits(['upOrder', 'downOrder']);

function emitUpOrder() {
    emit('upOrder', props.task.id);
}

function emitDownOrder() {
    emit('downOrder', props.task.id);
}

</script>