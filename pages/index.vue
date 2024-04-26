<template>
    <div>
      <h1>Tasks list</h1>
      <ImportTasks />
      <ExportTasks />
      --------
      <AddTask />
        <li v-for="item in tasks">
          <Task />
      </li>
    </div>
</template>

<script setup lang="ts">
/**
 * Task List Page
 * @description Tasks list manager
 * 
 */

import { ref } from 'vue';
import AddTask from '~/components/actions/AddTask.vue';
const tasks = ref(new Array<{}>(2));

</script>