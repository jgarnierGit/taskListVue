<template>
  <div>{{ task.name }}
    ________
    <EditTaskName />
    ----
    <TaskStatus />
    ----
    <!-- ActionsMenu -->
    <div>
      <ReorderTask />
      <UpdateTaskStatus />
      <DeleteTask />
    </div>
    ________
  </div>
</template>

<script setup lang="ts">
/**
 * Task Component
 * @description A TaskManager has the following behaviors:
 *  - edition is disabled if one of its childs is still created.
 *  - switch to {TaskStatus.Done} when its last child is done.
 *  - a contextual editor menu
 * 
 */

import TaskStatus from './infos/TaskStatus.vue';
import EditTaskName from './actions/EditTaskName.vue';
import UpdateTaskStatus from './actions/UpdateTaskStatus.vue';
import ReorderTask from './actions/ReorderTask.vue';
import DeleteTask from './actions/DeleteTask.vue';
import type { Task } from '~/Interfaces';

defineProps<{ task: Task }>();

</script>