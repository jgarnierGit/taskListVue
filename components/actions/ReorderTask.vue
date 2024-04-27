<template>
    <button type="button" id="up-reorder" @click="$emit('upOrder', task)">up</button> / <button type="button"
        id="down-reorder" @click="$emit('downOrder', task)">down</button>
</template>

<script setup lang="ts">
import type { Task } from '~/Interfaces';

/**
 * ReorderTask Component
 * @description Moves targeted task at the desired position of the current sublist.
 * 
 */
defineProps<{ task: Task }>();
defineEmits(['upOrder', 'downOrder']);

</script>