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
    <TasksList :task="root" />
    <!-- REVIEW: passing the reference as a props means that child components mutate the ref, which is not a good practice (props down, events up) and v-model should be prefered -->
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

</script>