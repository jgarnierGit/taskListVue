<template>
  <span>
    <v-text-field data-testid="editTaskName" ref="taskNameInput" :model-value="task.name" :rules="[required]"
      placeholder="Edit task name" persistent-placeholder :variant="getVariant" @click.stop="enableInput"
      @blur="disableInput" @keydown.enter.stop="disableInput"></v-text-field>
  </span>
</template>

<script setup lang="ts">
/**
 * EditTaskName Component
 * @description Task name editor
 * 
 */

import { ref } from 'vue';
import type { Task } from '~/Interfaces';

defineProps<{ task: Task }>();

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