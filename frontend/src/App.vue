<template lang="pug">
router-view 
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from 'vue';
import { environment } from '@/environments/environment';
import { Api } from 'eosjs';
// import { Ax } from '@/apis';

export default defineComponent({
    setup() {
        // const EOS = inject('AMAX') as Api;
        const state = reactive<any>({
            netName: '',
            networks: [],
            frontConfig: environment.frontConfig,
        });

        const getMainFrontConfig = () => {
            state.frontConfig.nets.forEach((elem: any) => {
                if (elem.active) {
                    return (state.netName = elem.name);
                }
                state.networks.push(elem);
            });
        };

        const onInit = async () => {
            getMainFrontConfig();
            // TODO 如果登陆。获取用户信息
            // EOS.rpc.get_info().then(res => {
            //     // console.log(res);
            //     // getAccount();
            // });
        };

        onInit();

        return {
            ...toRefs(state),
        };
    },
});
</script>


<style lang="scss">
.router-link-exact-active {
    @apply text-green;
}
</style>