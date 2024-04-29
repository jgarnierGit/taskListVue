<template>
    <v-btn density="compact" id="delete-task" @click="emitDelete"><v-icon>$trashCanOutline </v-icon></v-btn>
</template>

<script setup lang="ts">
/**
 * DeleteTask Component
 * @description Remove targeted task and its childs recursively.
 *
 */
const props = defineProps<{ taskId: string }>();
const emit = defineEmits(['delete']);

function emitDelete() {
    // TODO if component has childs, raise a warning to the user before removing.
    emit('delete', props.taskId);
}

</script>