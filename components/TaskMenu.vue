<template>
    <v-btn icon :id="'menu-activator-' + index">
        <v-icon>$dotsVertical</v-icon>
        <v-menu :activator="'#menu-activator-' + index">
            <v-list>
                <v-list-item>
                    <ReorderTask :task="task" @up-order="upOrderFn" @down-order="downOrderFn" />
                </v-list-item>
                <v-list-item title="updateStatus">
                    <UpdateTaskStatus />
                </v-list-item>
                <v-list-item title="delete">
                    <DeleteTask />
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>

<script setup lang="ts">
import UpdateTaskStatus from './actions/UpdateTaskStatus.vue';
import ReorderTask from './actions/ReorderTask.vue';
import DeleteTask from './actions/DeleteTask.vue';
import type { Task } from '~/Interfaces';

const props = defineProps<{ task: Task, index: number, upOrderFn: (taskId: number) => void, downOrderFn: (taskId: number) => void }>();
import { onMounted } from 'vue'

onMounted(() => {
    console.log(`the component is now mounted.`, props.task, props.index);
})
</script>