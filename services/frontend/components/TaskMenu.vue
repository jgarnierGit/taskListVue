<template>
    <v-btn icon :id="`menu-activator-${index}`" @click.stop>
        <v-icon>$dotsVertical</v-icon>
        <v-menu :activator="`#menu-activator-${index}`">
            <v-list>
                <!-- reorder -->
                <v-list-item>
                    <v-btn density="compact" id="up-reorder" @click="$emit('upOrder', task.id)">
                        <v-icon>$transferUp</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="down-reorder" @click="$emit('downOrder', task.id)">
                        <v-icon>$transferDown</v-icon>
                    </v-btn>
                </v-list-item>
                <!-- update status -->
                <v-list-item>
                    <v-btn prepend-icon="$check" v-if="!isCompleted" id="complete-task"
                        @click="$emit('statusUpdate', task.id)">
                        Complete
                    </v-btn>
                    <v-btn prepend-icon="$autorenew" v-else id="unvalidate-task"
                        @click="$emit('statusUpdate', task.id)">
                        Undone
                    </v-btn>
                </v-list-item>
                <!-- delete task -->
                <v-list-item>
                    <v-btn density="compact" id="delete-task" @click="$emit('delete', task.id)">
                        <v-icon>$trashCanOutline</v-icon>
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-btn>
</template>

<script setup lang="ts">
/**
 * TaskMenu Component
 * @description Menu interface for Task actions
 * 
 */
import type { Task } from '~/commons/Interfaces';

const props = defineProps<{
    task: Task,
    index: string,
}>();

defineEmits(['delete', 'upOrder', 'downOrder', 'statusUpdate']);

const isCompleted = computed(() => {
    return !!props.task.isDone;
});
</script>