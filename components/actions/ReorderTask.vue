<template>
    <button type="button" id="up-reorder" @click="up">up</button> / <button type="button" id="down-reorder"
        @click="down">down</button>
</template>

<script setup lang="ts">
import type { Task } from '~/Interfaces';

/**
 * ReorderTask Component
 * @description Moves targeted task at the desired position of the current sublist.
 * 
 */
defineProps<{ task: Task }>();

function up() {
    console.log("goes up");
}
function down() {
    console.log("goes down");
}

</script>