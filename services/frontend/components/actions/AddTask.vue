<template>
    <v-list-item @click="emitAddTask" density="compact" v-if="!disabled">
        <v-tooltip location="start center" origin="auto" :text="`Add task ${label}`" activator="parent" />
        <v-hover v-slot="{ isHovering, props }">
            <v-divider :thickness="20" class="border-opacity-0" v-bind="props" cover>
                <slot width="100%"></slot>
                <v-expand-transition>
                    <div v-if="isHovering" style="height: 100%;" class="text-center">
                        <v-icon>$plus</v-icon>
                    </div>
                </v-expand-transition>
            </v-divider>
        </v-hover>
    </v-list-item>


    <v-list-item v-else density="compact">
        <v-tooltip location="start center" origin="auto" :text="`Add task ${label}`" activator="parent" />
        <slot></slot>
    </v-list-item>
</template>

<script setup lang="ts">
/**
 * AddInlineTask Component
 * @description Add a new task at the specified position or at 0 position of the active sublist.
 * 
 */

const props = withDefaults(defineProps<{ taskId?: string, label?: string, disabled?: boolean }>(), {
    label: () => ""
});
const emit = defineEmits(['addTask']);

function emitAddTask() {
    emit('addTask', props.taskId);
}

</script>