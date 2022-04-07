<template lang="pug">
Wrapper.pt-4
    .flex.space-x-8
        Block(class='w-2/5', title='Blocks')
            .px-4.py-2.font-normal(v-if='!state.blocks.length') 暂无数据
            table.table.w-full(v-else)
                thead
                    tr
                        th Number
                        th Transactions
                        th Producer
                        th Time
                tbody
                    tr(v-for='(item, index) in state.blocks', :key='index')
                        th
                            span.text-green(@click='$router.push(`/block/${item?.block_num}`)') {{ item?.block_num.toLocaleString() }}
                        th {{ item?.transactions.length }}
                        th
                            span.text-green(@click='$router.push(`/producer/${item?.producer}`)') {{ item?.producer }}
                        th.text-center {{ handleTime(item?.timestamp) }}

        Block(class='w-3/5', title='Latest Actions')
            .px-4.py-2.font-normal(v-if='!state.hashs.length') 暂无数据
            table.table.w-full(v-else)
                thead
                    tr
                        th Tx Hash
                        th Action Name
                        th Data
                tbody
                    tr(v-for='(item, index) in state.hashs', :key='index')
                        th 
                            span.text-green(@click='$router.push(`/transaction/${item?.block_num}`)') {{ item?.block_num.toLocaleString() }}
                        th.font-medium {{ item?.name }}
                        th 
</template>

<script lang="ts">
import { defineComponent, reactive, inject, onDeactivated, onUnmounted, ref } from 'vue';
import Wrapper from '@/components/Wrapper.vue';
import Block from '@/components/Block.vue';
import moment from 'moment';
import { Ax } from '@/apis';
import { environment } from '@/environments/environment';
export default defineComponent({
    components: { Block, Wrapper },
    setup() {
        const offsetPageElems = ref(6);
        const frontConfig = ref(environment.frontConfig);
        const socket = inject('socket') as any;
        const ungerKey = ref('EOS1111111111111111111111111111111114T1Anm');
        const state = reactive({
            trxObj: {},
            spinner: false,
            blocks: [],
            hashs: [],
        });

        const handleTime = (timestamp?: any) => {
            return moment(timestamp).format('lll');
        };

        const createTransactionsArray = (data: any) => {
            if (!data) {
                return;
            }
            let transactions = [];
            let displayBlocks = [];

            data.forEach(elem => {
                if (elem.transactions && elem.transactions.length > 0) {
                    elem.transactions.forEach(tr => {
                        if (!state.trxObj[elem.block_num]) {
                            state.trxObj[elem.block_num] = [];
                        }
                        let actions = [];
                        if (tr.trx && tr.trx.transaction && tr.trx.transaction.actions) {
                            actions = tr.trx.transaction.actions.map(act => {
                                act.block_num = tr.trx.id;
                            });
                            Array.prototype.push.apply(state.trxObj[elem.block_num], tr.trx.transaction.actions);
                        }
                    });
                }
            });

            Object.keys(state.trxObj).forEach(key => {
                Array.prototype.push.apply(transactions, state.trxObj[key]);
            });
            transactions.reverse();

            if (transactions.length >= offsetPageElems.value) {
                let blocks = Object.keys(state.trxObj);
                blocks.forEach((key, index) => {
                    if (index < blocks.length - offsetPageElems.value) {
                        delete state.trxObj[key];
                    }
                });
                return transactions.slice(0, offsetPageElems.value);
            }

            return transactions;
        };

        const calculateEosFromVotes = votes => {
            let date = +new Date() / 1000 - 946684800; // 946... start timestamp
            if (frontConfig.value.coin === 'WAX') {
                let weight = parseInt(`${date / (86400 * 7)}`, 10) / 13;
                return votes / 2 ** weight / 100000000;
            }
            let weight = parseInt(`${date / (86400 * 7)}`, 10) / 52; // 86400 = seconds per day 24*3600
            return votes / 2 ** weight / 10000;
        };
        const sortArray = (data: any) => {
            if (!data) {
                return;
            }
            let result = [];
            data.sort((a, b) => {
                return b.total_votes - a.total_votes;
            }).forEach((elem, index) => {
                if (elem.producer_key === ungerKey.value) {
                    return;
                }
                let eos_votes = Math.floor(calculateEosFromVotes(elem.total_votes));
                elem.all_votes = elem.total_votes;
                elem.total_votes = Number(eos_votes).toLocaleString();

                result.push(elem);
            });
            return result;
        };

        const getData = () => {
            state.spinner = true;
            Ax.get('/api/v1/get_last_blocks/6')
                .then((res: any) => {
                    state.blocks = sortArray(res);
                    state.hashs = createTransactionsArray(res);
                    state.spinner = false;
                })
                .catch(error => {
                    console.error(error);
                    state.spinner = false;
                });
        };

        const onInit = () => {
            getData();

            socket.on('get_last_blocks', (res: any) => {
                state.blocks = sortArray(res);
                state.hashs = createTransactionsArray(res);
            });
        };

        onInit();

        onDeactivated(() => {
            socket.close();
            socket.disconnect();
        });
        onUnmounted(() => {
            socket.close();
            socket.disconnect();
        });

        return {
            frontConfig,
            state,
            handleTime,
        };
    },
});
</script>