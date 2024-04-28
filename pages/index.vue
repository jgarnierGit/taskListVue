<template>
  <v-card class="mx-auto" width="600">
    <v-toolbar dark>
      <v-toolbar-title>
        Tasks list
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="createItem()">$plus</v-icon>
      </v-btn>
    </v-toolbar>
    <ImportTasks />
    <ExportTasks />
    --------
    <AddTask />
    <TasksList :task="rootTask" />
  </v-card>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */

import { TaskStatus, type ITask } from '~/Interfaces';
import AddTask from '~/components/actions/AddTask.vue';
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
const rootTask = ref({ tasks });

function createItem() {
  console.log("TODO, link to add component");
}

</script>