<template>
  <div>
    ________
    <EditTaskName />
    ----
    <TaskStatus />
    ----
    <!-- ActionsMenu -->
    <div>
      <ReorderTask/>
      <UpdateTaskStatus/>
      <DeleteTask/>
    </div>
    ________
  </div>
</template>

<script setup lang="ts">
/**
 * Task Component
 * @description A task has the following properties:
 *  - a name
 *  - a status (Created / Done) : 
 *     - edition is disabled if one of its childs is still Created.
 *     - switch to Done when its last child is Done.
 *  - a sublist of Task
 *  - a contextual editor menu
 * 
 */

import TaskStatus from './infos/TaskStatus.vue';
import EditTaskName from './actions/EditTaskName.vue';
import UpdateTaskStatus from './actions/UpdateTaskStatus.vue';
import ReorderTask from './actions/ReorderTask.vue';
import DeleteTask from './actions/DeleteTask.vue';

</script>