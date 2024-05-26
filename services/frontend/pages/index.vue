<template>
  <v-card class="mx-auto" width="600">
    <v-toolbar dark>
      <v-toolbar-title>
        Tasks manager
      </v-toolbar-title>
    </v-toolbar>
    <v-divider :thickness="5" />
    <v-progress-linear indeterminate v-if="store.isLoadingRunning"></v-progress-linear>
    <v-toolbar>
      <v-toolbar-items class="import-export">
        <ImportTasks v-model="root" />
      </v-toolbar-items>
      <v-divider vertical></v-divider>
      <v-toolbar-items class="import-export">
        <ExportTasks :task="root" />
      </v-toolbar-items>
    </v-toolbar>
    <v-divider :thickness="5" />
    <TaskListTree v-model="root" />
  </v-card>
  <TestCelery></TestCelery>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */
import type { TaskList } from '~/commons/Interfaces';
const store = useLazyLoadingStore();

const root: TaskList = reactive({ tasks: [] });

</script>

<style>
.v-toolbar-items.import-export {
  flex: 1 1 content;
  column-gap: 20px;
}
</style>