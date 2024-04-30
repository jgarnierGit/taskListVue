<template>
    <v-btn icon :id="`menu-activator-${index}`" @click.stop>
        <v-icon>$dotsVertical</v-icon>
        <v-menu :activator="`#menu-activator-${index}`">
            <v-list>
                <v-list-item>
                    <ReorderTask :task="task" @up-order="upOrderFn" @down-order="downOrderFn" />
                </v-list-item>
                <v-list-item title="updateStatus">
                    <UpdateTaskStatus />
                </v-list-item>
                <v-list-item>
                    <DeleteTask :taskId="task.id" @delete="deleteFn" />
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

defineProps<{
    task: Task,
    index: string,
    upOrderFn: (taskId: string) => void,
    downOrderFn: (taskId: string) => void,
    deleteFn: (taskId: string) => void
}>();

</script>