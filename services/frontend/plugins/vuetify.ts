import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiAutorenew, mdiCheck, mdiChevronDown, mdiChevronUp, mdiFormSelect, mdiDotsVertical, mdiDownload, mdiFileExport, mdiFileImport, mdiPencil, mdiPlus, mdiTransferDown, mdiTransferUp, mdiTrashCanOutline, mdiFamilyTree, mdiArrowExpandVertical, mdiArrowExpandHorizontal, mdiFileTreeOutline, mdiAlert, mdiFormTextbox } from '@mdi/js';

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        theme: {
            defaultTheme: 'dark',
        },
        icons: {
            defaultSet: 'mdi',
            aliases: {
                ...aliases,
                plus: mdiPlus,
                dotsVertical: mdiDotsVertical,
                transferUp: mdiTransferUp,
                transferDown: mdiTransferDown,
                trashCanOutline: mdiTrashCanOutline,
                download: mdiDownload,
                check: mdiCheck,
                autorenew: mdiAutorenew,
                pencil: mdiPencil,
                chevronDown: mdiChevronDown,
                chevronUp: mdiChevronUp,
                mdiFileImport: mdiFileImport,
                mdiFileExport: mdiFileExport,
                mdiFormSelect: mdiFormSelect,
                mdiFamilyTree: mdiFamilyTree,
                mdiArrowExpandVertical: mdiArrowExpandVertical,
                mdiArrowExpandHorizontal: mdiArrowExpandHorizontal,
                mdiFileTreeOutline: mdiFileTreeOutline,
                mdiAlert: mdiAlert,
                mdiFormTextbox: mdiFormTextbox
            },
            sets: {
                mdi,
            },
        },
    });

    nuxtApp.vueApp.use(vuetify);
});