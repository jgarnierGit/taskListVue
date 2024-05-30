<template>
    <v-navigation-drawer permanent>
        <v-list-item title="Menu"></v-list-item>
        <v-divider></v-divider>
        <v-list density="compact">

            <!-- import -->
            <v-list-item data-testid="menu-import-dialog" prepend-icon="$mdiFileImport" title="Import" value="Import"
                :active="false" :disabled="jobStore.isJobRunning">
                <v-dialog v-model="importDialog" max-width="600" activator="parent" transition="dialog-top-transition"
                    persistent>
                    <template v-slot:default="{ isActive }">
                        <v-card prepend-icon="$mdiFileImport" text="Load and replace JSON task tree."
                            title="Tree loader">
                            <v-card-text>
                                <ImportTasks v-model="root" @after-import="isActive.value = false"
                                    @start-upload="importStartUpload = true" />
                            </v-card-text>
                            <template v-slot:actions>
                                <v-btn v-if="!importStartUpload" class="ml-auto" text="Close"
                                    :disabled="jobStore.isJobRunning" @click="closeDialog(isActive)"></v-btn>
                                <v-btn v-else class="ml-auto" text="Cancel job" :disabled="!jobStore.isJobRunning"
                                    @click="cancelIfRunning(jobStore.jobRunningId); closeDialog(isActive)"
                                    color="error"></v-btn>
                            </template>
                        </v-card>
                    </template>
                </v-dialog>
            </v-list-item>

            <!-- export -->
            <v-list-item data-testid="menu-export-dialog" prepend-icon="$mdiFileExport" title="Export" value="Export"
                @click="exportTree" :active="false" :disabled="isEmptyList || jobStore.isJobRunning"></v-list-item>
            <!-- create -->
            <v-row>
                <v-col>
                    <v-list-item data-testid="menu-create-dialog" prepend-icon="$mdiFormSelect" title="Create"
                        value="Create" :active="false" :disabled="jobStore.isJobRunning">
                        <v-dialog v-model="createDialog" max-width="600" activator="parent"
                            transition="dialog-top-transition" persistent>
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
                                    <GenerateTree @processing="(jobId) => closeCreateDialog(jobId, isActive)" />
                                    <template v-slot:actions>
                                        <v-btn class="ml-auto" text="Close" @click="closeDialog(isActive)">
                                        </v-btn>
                                    </template>
                                </v-card>
                            </template>
                        </v-dialog>
                    </v-list-item>
                </v-col>
                <v-col cols="5" v-show="jobStore.isJobRunning && createJobId">
                    <v-row>
                        <v-col>
                            <v-tooltip text="Refresh status" location="top" v-if="createJobOutOfRetry">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" icon="$mdiRefresh" @click="waitResult" density="compact"
                                        size="small" variant="tonal">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-progress-circular v-else indeterminate :width="2" size="small"></v-progress-circular>

                        </v-col>
                        <v-col>
                            <v-tooltip text="Cancel creation" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" icon="$mdiStop" @click="cancelIfRunning(createJobId)"
                                        density="compact" size="small" color="error" variant="tonal">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </v-col>
                    </v-row>



                </v-col>
            </v-row>
        </v-list>
    </v-navigation-drawer>


</template>
<script setup lang="ts">
import type { TaskList } from '~/commons/Interfaces';
import { SNACKBAR_TIMEOUT } from '~/commons/const';

const root = defineModel<TaskList>({ required: true });
const isEmptyList = computed(() => root.value.tasks.length === 0);
const jobStore = useJobsStore();
const snackbarStore = useSnackbarStore();
const createJobOutOfRetry = ref(false);
const importStartUpload = ref(false);
const createJobId = ref<string>();

const { jobResult } = storeToRefs(jobStore)

watch(jobResult, (newVal) => {
    if (newVal) {
        if (newVal.status === "RETRY_ENDS") {
            createJobOutOfRetry.value = true;
        }
        else if (newVal.status !== "PENDING") {
            createJobOutOfRetry.value = false;
            createJobId.value = undefined;
        }
    }
})

const importDialog = ref(false);
const createDialog = ref(false);

async function waitResult() {
    if (createJobId.value) {
        await jobStore.getJobResult(createJobId.value);
    }
}

function exportTree() {
    const json = JSON.stringify(root.value, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();
}

async function cancelIfRunning(jobId?: string) {
    if (jobId) {
        await jobStore.cancelJob(jobId);
        snackbarStore.setContent(`Cancelled job ${jobId}`, SNACKBAR_TIMEOUT, "success");
    }
}
function closeCreateDialog(jobId: string, isActive: Ref) {
    createJobId.value = jobId;
    isActive.value = false;
}
function closeDialog(isActive: Ref) {
    isActive.value = false;
}
</script>