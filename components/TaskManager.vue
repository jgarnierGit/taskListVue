<template>
  <slot></slot>
  <EditTaskName :task="task" />
  <TaskStatus :task="task" />
</template>

<script setup lang="ts">
/**
 * Task Component
 * @description A TaskManager has the following behaviors:
 *  - edition is disabled if one of its childs is still created.
 *  - switch to {TaskStatus.Done} when its last child is done.
 * 
 */

import TaskStatus from './infos/TaskStatus.vue';
import EditTaskName from './actions/EditTaskName.vue';
import type { Task } from '~/Interfaces';

defineProps<{ task: Task }>();
</script>