<template>
  <v-card class="mx-auto" width="600">
    <v-toolbar dark>
      <v-toolbar-title>
        Tasks list
      </v-toolbar-title>
    </v-toolbar>
    <ImportTasks v-model="rootTask" />
    <ExportTasks :task="rootTask" />

    <div>
      Start creating by clicking below
    </div>
    <v-divider :thickness="5" />
    <TasksList :task="rootTask" />
  </v-card>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */

import { TaskStatus, type RootTask, type Task } from '~/Interfaces';

// mock test
const tasks: Task[] = [
  {
    id: "1",
    name: "1",
    status: TaskStatus.CREATED,
    tasks: [
      {
        id: "4",
        name: "1.1",
        status: TaskStatus.CREATED,
        tasks: [],
      },
      {
        id: "2",
        name: "1.2",
        status: TaskStatus.DONE,
        tasks: [
          {
            id: "5",
            name: "1.2.1",
            status: TaskStatus.DONE,
            tasks: [],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "2",
    status: TaskStatus.DONE,
    tasks: [],
  },
];
const tasksEmpty: Task[] = [];
const rootTask = reactive({ tasks: tasks });

</script>