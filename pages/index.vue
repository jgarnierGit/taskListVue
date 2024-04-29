<template>
  <v-card class="mx-auto" width="600">
    <v-toolbar dark>
      <v-toolbar-title>
        Tasks list
      </v-toolbar-title>
    </v-toolbar>
    <ImportTasks />
    <ExportTasks />
    --------
    <EmptyHack />
    Start creating by clicking
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

import { TaskStatus } from '~/Interfaces';
import EmptyHack from '~/components/actions/EmptyHack.vue';
// mock test
const tasks = [
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
const tasksEmpty = ref([]);
const rootTask = ref({ tasks });

</script>