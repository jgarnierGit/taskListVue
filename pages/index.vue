<template>
  <div>
    <h1>Tasks list</h1>
    <ImportTasks />
    <ExportTasks />
    --------
    <AddTask />
    <TasksList :task="rootTask" />
  </div>
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
    id: 1,
    name: "1",
    status: TaskStatus.CREATED,
    tasks: [
      {
        id: 4,
        name: "1.1",
        status: TaskStatus.CREATED,
        tasks: [],
      },
      {
        id: 2,
        name: "1.2",
        status: TaskStatus.DONE,
        tasks: [
          {
            id: 5,
            name: "1.2.1",
            status: TaskStatus.DONE,
            tasks: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "2",
    status: TaskStatus.DONE,
    tasks: [],
  },
];

const rootTask: ITask = { tasks };

</script>