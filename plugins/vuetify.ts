import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiAutorenew, mdiCheck, mdiDotsVertical, mdiDownload, mdiPlus, mdiTransferDown, mdiTransferUp, mdiTrashCanOutline } from '@mdi/js';

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
                autorenew: mdiAutorenew
            },
            sets: {
                mdi,
            },
        },
    });

    nuxtApp.vueApp.use(vuetify);
});