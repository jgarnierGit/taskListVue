<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Tasks manager" class="text-center"></v-app-bar>
    <AppMenu v-model="root" />
    <v-main>
      <v-container class="py-10 px-10" min-height="40vh" fluid>
        <v-row>
          <v-col cols="12">
            <v-card>
              <TaskListTree v-model="root" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
  <TestCelery></TestCelery>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */
import type { TaskList } from '~/commons/Interfaces';

const root: TaskList = reactive({ tasks: [] });

</script>
