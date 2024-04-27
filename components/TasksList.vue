<template>
    <li v-for="subTask in task.tasks" v-if="!!task.tasks.length">
        <TaskManager :task="subTask" />
        <div v-if="!!subTask.tasks.length">
            sublisting {{ subTask.name }}
            <TasksList :task="subTask" />
        </div>
    </li>

</template>

<script setup lang="ts">
import type { ITask } from '~/Interfaces';

defineProps<{ task: ITask }>();
</script>