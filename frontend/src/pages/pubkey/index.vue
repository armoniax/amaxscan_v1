<template lang="pug">
.py-4.space-y-4.mb-8.px-2.lg_px-0
    h2.lg_text-2xl.text-xl Accounts by Public Key:
    .flex.items-center
        .w-24.lg_w-44 Public Key:
        .flex-1
            span.text-gray-999.break-all {{ address }}
    .flex.items-center
        .w-24.lg_w-44 Accounts:
        .flex-1
            .text-green.cursor-pointer.break-all(v-for='(name, index) in state.mainData?.account_names', :key='index', @click='$router.push(`/account/${name}`)') {{ name }}
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment';
import { GET_KEY_ACCOUNTS } from '@/apis';


export default defineComponent({
    setup() {
        const route = useRoute();
        const address = computed(() => route.params.address as string);
        const state = reactive({
            mainData: null,
            addressBlock: null,
        });

        const getPubkeyAccountData = pubkey => {
            console.log('pubkey======', pubkey)
            
            GET_KEY_ACCOUNTS(pubkey).then((res: any) => {
                state.mainData = (res && !res.account_names) ? createArrayAccounts(res): res;
            });
        };

        const createArrayAccounts = (data) => {
            let result = {
                account_names: []
            };
            if (data && data.account_names){
                data = data.account_names;
            }
            data.forEach(elem => {
                if (elem.permission === "active"){
                    result.account_names.push(elem.account); 
                }  
            });
            return result;
        };

        const onInit = () => {
            getPubkeyAccountData(address.value);
        };

        onInit();

        return {
            state,
            address
        };
    },
});
</script>
