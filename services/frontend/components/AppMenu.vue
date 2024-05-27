<template>
    <v-navigation-drawer permanent>
        <v-list-item title="Menu"></v-list-item>
        <v-divider></v-divider>
        <v-list density="compact">

            <!-- import -->
            <v-list-item data-testid="menu-import-dialog" prepend-icon="$mdiFileImport" title="Import" value="Import"
                :active="false">
                <v-dialog v-model="importDialog" max-width="600" activator="parent" transition="dialog-top-transition"
                    persistent>
                    <template v-slot:default="{ isActive }">
                        <v-card prepend-icon="$mdiFileImport" text="Load and replace JSON task tree."
                            title="Tree loader">
                            <v-card-text>
                                <ImportTasks v-model="root" @after-import="isActive.value = false" />
                            </v-card-text>
                            <template v-slot:actions>
                                <v-btn class="ml-auto" text="Close" @click="isActive.value = false"></v-btn>
                            </template>
                        </v-card>
                    </template>
                </v-dialog>
            </v-list-item>

            <!-- export -->
            <v-list-item data-testid="menu-export-dialog" prepend-icon="$mdiFileExport" title="Export" value="Export"
                @click="exportTree" :active="false" :disabled="isEmptyList"></v-list-item>

            <!-- create -->
            <v-list-item data-testid="menu-create-dialog" prepend-icon="$mdiFormSelect" title="Create" value="Create"
                :active="false">
                <v-dialog v-model="createDialog" max-width="600" activator="parent" transition="dialog-top-transition"
                    persistent>
                    <template v-slot:default="{ isActive }">
                        <v-card prepend-icon="$mdiFamilyTree" title="Tree generator">
                            <template v-slot:text>
                                Generate a random tree.
                                <v-alert icon="$mdiAlert" variant="outlined">
                                    <template v-slot:text>
                                        High values can be resource consuming.<br /> You can refer to
                                        <a href="http://localhost:5000" target="_blank"
                                            id="grafana-tooltip">Grafana</a><v-tooltip text="cf ./README.md"
                                            activator="#grafana-tooltip"></v-tooltip> for monitoring
                                        performances.
                                    </template>
                                </v-alert>
                            </template>
                            <GenerateTree />
                            <template v-slot:actions>
                                <v-btn class="ml-auto" text="Close" @click="isActive.value = false"></v-btn>
                            </template>
                        </v-card>
                    </template>
                </v-dialog>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>


</template>
<script setup lang="ts">
import type { TaskList } from '~/commons/Interfaces';

const root = defineModel<TaskList>({ required: true });
const isEmptyList = computed(() => root.value.tasks.length === 0);

const importDialog = ref(false);
const createDialog = ref(false);


function exportTree() {
    const json = JSON.stringify(root.value, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();
}

</script>