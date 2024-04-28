<template>
  <span>
    <span v-if="isDisabled">{{ inputValue }}</span>
    <input type="text" :value="inputValue" :disabled="isDisabled" v-if="!isDisabled" />
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

const props = defineProps<{ task: Task }>();

const inputValue = ref(props.task.name);
const isDisabled = ref(true);

function enableInput() {
  console.log("switching edition name");
}
</script>