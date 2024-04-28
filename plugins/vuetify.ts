import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiDotsVertical, mdiPlus, mdiTransferDown, mdiTransferUp } from '@mdi/js';

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
                transferDown: mdiTransferDown
            },
            sets: {
                mdi,
            },
        },
    });

    nuxtApp.vueApp.use(vuetify);
});