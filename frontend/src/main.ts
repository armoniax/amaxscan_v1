import { createApp } from 'vue';
import router from '@/routers';
import store from '@/store';
import App from './App.vue';
import SocketIO from '@/utils/io';
import EOS from '@/utils/eos';
import { createI18n } from 'vue-i18n';
import messages from './lang';

const i18n = createI18n({
  messages,
  locale: localStorage.lang || 'en',
});

(window as any).env =  import.meta.env

import '@/assets/css/reset.css';
import '@/assets/css/tailwind.css';
import '@/assets/css/web-fonts-with-css/css/fontawesome-all.min.css';
createApp(App).use(SocketIO).use(EOS).use(i18n).use(router).use(store).mount('#app');
