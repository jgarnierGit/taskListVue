<template>
  <v-card class="mx-auto" width="600">
    <v-toolbar dark>
      <v-toolbar-title>
        Tasks list
      </v-toolbar-title>
    </v-toolbar>
    <ImportTasks v-model="root" />
    <ExportTasks :task="root" />

    <div>
      Start creating by clicking below
    </div>
    <v-divider :thickness="5" />
    <AddTask @add-task="addTaskRoot" id="add-inline-root" v-if="!root.tasks.length" />

    <v-list dense dark v-for="(subTask, index) in root.tasks">
      <TasksList v-model:task="root.tasks[index]" v-model:parent="root" :index="index" />
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */

import { type TaskList } from '~/types/Interfaces';

const root: TaskList = reactive({ tasks: [] });

function addTaskRoot() {
  const newTask = createTask();
  root.tasks.push(newTask);
}

</script>