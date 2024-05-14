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

import { type RootTask } from '~/types/Interfaces';
const rootTask: RootTask = reactive({ tasks: [] });

</script>