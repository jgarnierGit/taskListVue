<template>
  <span>
    <v-text-field data-testid="edit-task-name" ref="taskNameInput" v-model="taskName" :rules="[required]"
      placeholder="Edit task name" persistent-placeholder :variant="getVariant" @click.stop="enableInput"
      @blur="disableInput" @keydown.enter.stop="disableInput" @keydown.space.stop></v-text-field>
  </span>
</template>

<script setup lang="ts">
/**
 * EditTaskName Component
 * @description Task name editor
 * 
 */

import { computed, ref } from 'vue';
const taskName = defineModel('taskName');

const required = (value: string) => { return !!value || 'Required.' };

const isDisabled = ref(true);

const taskNameInput = ref<HTMLInputElement | null>(null);


const getVariant = computed(() => {
  return isDisabled.value ? 'plain' : 'outlined';
})

function enableInput() {
  isDisabled.value = false;
}
function disableInput() {
  isDisabled.value = true;
  // make sure to loose focus when pressing enter
  taskNameInput.value?.blur();
}
</script>