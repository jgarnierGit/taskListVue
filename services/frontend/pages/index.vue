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
    <TaskListTree v-model="root" />
  </v-card>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */
import type { TaskList } from '~/types/Interfaces';

const tasks = [
  {
    id: "1",
    name: "1",
    isDone: false,
    tasks: [
      {
        id: "4",
        name: "1.1",
        isDone: false,
        tasks: [],
      },
      {
        id: "2",
        name: "1.2",
        isDone: true,
        tasks: [
          {
            id: "5",
            name: "1.2.1",
            isDone: true,
            tasks: [],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "2",
    isDone: true,
    tasks: [],
  },
];

const root: TaskList = reactive({ tasks: [] });

</script>