// @ts-ignore
import io from 'socket.io-client';
import { App } from 'vue';
// import Cookies from 'js-cookie';

export default {
    install(app: App) {
        const socket = io();
        app.config.globalProperties.$socket = socket;
        app.provide('socket', socket);
    },
};
