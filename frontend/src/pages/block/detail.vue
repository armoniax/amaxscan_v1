<template lang="pug">
.py-4.space-y-4.mb-8
    .flex.items-center.justify-start.space-x-4
        h2.text-2xl Block NO. {{ state.mainData.blockId }}
        span.text-green.cursor-pointer(@click='$router.push(`/block/${Number(state.mainData.blockId) - 1}`)')
            i.far.fa-long-arrow-left.mr-1
            | Prev
        span.text-green.cursor-pointer(@click='$router.push(`/block/${Number(state.mainData.blockId) + 1}`)')
            | Next
            i.far.fa-long-arrow-right.ml-1

    .flex.justify-center.items-center(v-if='state.spinner', style='height: 100%')
        span.font-medium.text-7xl.text-gray-999 Loading...

    template(v-else) 
        .flex.items-center.h-8(v-if='state.mainData?.producer')
            .w-44 Producer:
            .flex-1.text-green
                span.cursor-pointer(@click='$router.push(`/account/${state.mainData?.producer}`)') {{ state.mainData?.producer }}
        .flex.items-center.h-8(v-if='state.mainData?.id')
            .w-44 Id:
            .flex-1
                span.text-gray-999 {{ state.mainData?.id }}
        .flex.items-center.h-8(v-if='state.mainData?.previous')
            .w-44 Previous:
            .flex-1
                span.text-green.cursor-pointer(@click='$router.push(`/block/${state.mainData?.previous}`)') {{ state.mainData?.previous }}
        .flex.items-center.h-8(v-if='state.mainData?.confirmed')
            .w-44 Confirmations:
            .flex-1.text-gray-999 {{ state.mainData?.confirmed }}
        .flex.items-center.h-8(v-if='state.mainData?.action_mroot')
            .w-44 Action Mroot:
            .flex-1 {{ state.mainData?.action_mroot }}
        .flex.items-center.h-8(v-if='state.mainData?.transaction_mroot')
            .w-44 Transaction Mroot:
            .flex-1 {{ state.mainData?.transaction_mroot }}
        .flex.items-center.h-8(v-if='state.time')
            .w-44 Time:
            .flex-1.text-gray-999 {{ state.time }}
        .flex.items-center.h-8(v-if='state.mainData?.transactions')
            .w-44 Transactions:
            .flex-1.text-gray-999 {{ state.mainData?.transactions?.length }}

        RawDataBase(title='Blockchain Raw Data:', :json='state.mainData', v-if='state.mainData?.transactions?.length < 1000')

        template(v-if='state.trxArr.length')
            .overflow-scroll
                table.table.w-full
                    thead
                        tr
                            th Expiration
                            th CPU
                            th NET
                            th Id
                            th Status
                            th Actions
                    tbody
                        tr(v-for='(item, index) in state.trxArr', :key='index')
                            th {{ formatTime(item?.expiration) }}
                            th {{ item?.cpu }}
                            th {{ item?.net }}
                            th 
                                span.text-green.cursor-pointer(@click='$router.push(`/transaction/${item?.hash}`)') {{ item?.hash }}
                            th {{ item?.status }}
                            th {{ item?.action?.name }}

            .flex.justify-end.items-center.text-gray-666.py-3
                span Items per page:
                select.outline-none.h-6.w-20.border.rounded.mx-2.border-gray-f4.cursor-pointer(v-model='state.listQuery.size')
                    option(value='20') 20
                    option(value='50') 50
                    option(value='100') 100
                span {{ state.listQuery.page }} - {{ state.trxArr.length }} of {{ state.trxArr.length }}
                span.outline-none.h-6.w-6.border.rounded.mx-2.border-gray-f4.cursor-pointer.text-gray-666.text-center &lt;
                span.outline-none.h-6.w-6.border.rounded.border-gray-f4.cursor-pointer.text-gray-666.text-center >
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';
import { Ax } from '@/apis';
import { useRoute } from 'vue-router';
import moment from 'moment';
import JsonViewer from 'vue-json-viewer';
import RawDataBase from '@/components/RawData/Base.vue';

export default defineComponent({
    components: { RawDataBase, JsonViewer },
    setup() {
        const route = useRoute();
        const blockId = computed(() => route.params.block as string);
        const state = reactive({
            trxArr: [],
            spinner: false,
            mainData: null,
            time: '',
            listQuery: {
                page: 1,
                size: 50,
            },
        });

        const formatTime = (t?: any) => {
            return moment(t).format('MMMM Do YYYY, h:mm:ss a');
        };

        watch(blockId, () => {
            getBlockData();
        });

        const getBlockData = () => {
            state.spinner = true;
            Ax.get(`/v1/get_block/${blockId.value}`)
                .then((res: any) => {
                    state.mainData = res;
                    state.time = moment(res.timestamp).format('MMMM Do YYYY, h:mm:ss a');
                    if (res.transactions && res.transactions.length) {
                        state.trxArr = createTransactionsArray(res.transactions);
                    }
                    state.spinner = false;
                })
                .catch(error => {
                    state.spinner = false;
                });
        };

        const createTransactionsArray = data => {
            let result = [];

            data.forEach(elem => {
                if (typeof elem.trx === 'string') {
                    return;
                }
                result.push({
                    cpu: elem.cpu_usage_us,
                    net: elem.net_usage_words,
                    status: elem.status,
                    hash: elem.trx.id,
                    actions: elem.trx.transaction.actions,
                    expiration: elem.trx.transaction.expiration,
                });
            });
            return result;
        };

        const onInit = () => {
            getBlockData();
        };

        onInit();

        return {
            formatTime,
            blockId,
            state,
        };
    },
});
</script>