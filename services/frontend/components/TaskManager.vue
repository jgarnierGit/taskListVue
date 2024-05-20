<template>
  <div>
    <span :data-testid="`taskStatusDone-${task.id}`" v-if="!!props.task.isDone">
      <v-icon>$check</v-icon> Done
    </span>
    <span :data-testid="`taskStatusCreated-${task.id}`" v-else>Created</span>
  </div>
  <v-text-field data-testid="edit-task-name" ref="taskNameInput" v-model="task.name" :rules="[required]"
    placeholder="Edit task name" persistent-placeholder append-inner-icon="$pencil" @click.stop
    @keydown.enter.stop="disableInput()" @keydown.space.stop></v-text-field>
</template>

<script setup lang="ts">
/**
 * Task Component
 * @description A TaskManager has the following behaviors:
 *  - edition is disabled if one of its childs is still created.
 *  - switch to {TaskStatus.Done} when its last child is done.
 * 
 */

import type { Task } from '~/commons/Interfaces';

const props = defineProps<{ task: Task }>();

const required = (value: string) => { return !!value || 'Required.' };

const taskNameInput = ref<HTMLInputElement | null>(null);

function disableInput() {
  // make sure to loose focus when pressing enter
  taskNameInput.value?.blur();
}
</script>