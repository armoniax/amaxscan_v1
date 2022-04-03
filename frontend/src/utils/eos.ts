// @ts-ignore
import { Api, JsonRpc } from 'eosjs';
import { App } from 'vue';
// import Config from '../config';
// import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

export default {
    install(app: App) {
        window.global = window;
        // @ts-ignore
        // const EOS = EOSJS(Config.eosConfig);
        const EOS = new Api({
            // signatureProvider: new JsSignatureProvider(['']),
            // chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            rpc: new JsonRpc('https://amaxscan.io'),
        });
        app.config.globalProperties.$EOS = EOS;
        app.provide('EOS', EOS);
    },
};
