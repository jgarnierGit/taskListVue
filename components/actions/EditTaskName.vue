<template>
 Name editor :
  <span>
    <span v-if="isDisabled">{{ inputValue }}</span>
    <input
      type="text"
      :value="inputValue"
      :disabled="isDisabled"
      v-if="!isDisabled"
    />
  </span>
</template>

<script setup lang="ts">
/**
 * EditTaskName Component
 * @description Task name editor
 * 
 */

import { ref } from 'vue';

const inputValue = 'Default Value';
const isDisabled = ref(true);

function enableInput() {
    console.log("switching edition name");
}
</script>