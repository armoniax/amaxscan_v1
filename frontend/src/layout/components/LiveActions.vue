<template lang="pug">
.bg-green
    Wrapper.py-6.pb-4
        .grid.grid-cols-2.lg_grid-cols-5.gap-2.mb-3.px-2.lg_px-0
            .bg-white.p-4
                span RAM Price
                p.mt-2.text-green
                    | {{ state.ramPrice }}
                    span.ml-1.text-xs.font-normal {{ frontConfig?.coin }}/KB
            .bg-white.p-4
                span ACCOUNTS
                p.mt-2.text-green {{ state.aggragationData?.accounts?.toLocaleString() }}
            .bg-white.p-4
                span BLOCKS
                p.mt-2.text-green {{ state.blockchainData?.head_block_num?.toLocaleString() }}
            .bg-white.p-4
                span ACTIONS
                p.mt-2.text-green {{ state.aggragationData?.actions?.toLocaleString() }}
            .bg-white.p-4
                span PRODUCER
                p.mt-2.text-green.cursor-pointer(@click='$router.push(`/producers/${state.producer}`)') {{ state.producer }}

        .flex.items-center.justify-between.text-white.px-2.lg_px-0.text-sm
            span
                |   Users Online:
                span.lg_text-lg.mx-1 {{ state.usersOnline }}
                |   TPS_max:
                span.lg_text-lg.mx-1 {{ state.aggragationData?.max_tps?.toLocaleString() }}
                |   TPS_live:
                span.lg_text-lg.mx-1 {{ state.TPSLiveTx }}
            span.flex.items-center.cursor-pointer(@click='toggleShow')
                |   Live Actions
                i.fas.fa-chevron-down.ml-2(:class='modelValue ? "rotate-180" : ""')
</template>

<script lang="ts">
import { defineComponent, onDeactivated, onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';
import Wrapper from '@/components/Wrapper.vue';
import { GET_TABLE_ROWS, GET_AGGREGATION_STAT, GET_INFO, Ax } from '@/apis';
import { environment } from '@/environments/environment';
import { useStore } from 'vuex';
import { inject } from 'vue';
// import { Socket } from 'socket.io-client';

export default defineComponent({
    components: { Wrapper },
    props: {
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const socket = inject('socket') as any;
        const frontConfig = ref(environment.frontConfig);
        const timeForUpdate = ref(5000);
        const store = useStore();

        const state = reactive<any>({
            currencyObj: {},
            mainCurrencyChartDataRes: [],
            ramPrice: '0',
            producer: '',
            aggragationData: {},
            blockchainData: {},
            TPSLiveTx: 0,
            usersOnline: 0,
        });

        const getChart = () => {
            Ax.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${frontConfig.value.coin}&tsym=USD&limit=24&aggregate=3&e=CCCAGG&site=${location.hostname}`)
                .then((res: any) => {
                    // console.log(res);
                    if (res.Response === 'Error') return;
                    state.mainCurrencyChartDataRes = createChartArr(res.Data);
                    setTimeout(() => {
                        getChart();
                    }, timeForUpdate.value);
                })
                .catch(error => {
                    console.log(error);
                    setTimeout(() => {
                        getChart();
                    }, timeForUpdate.value);
                });
        };
        const createChartArr = (data: any[]) => {
            // console.log(data);
            let result: any[] = [];
            data.forEach(elem => {
                result.push({ name: new Date(elem.time * 1000), value: elem.close });
            });
            return result;
        };
        const getData = () => {
            Ax.get(`https://min-api.cryptocompare.com/data/price?fsym=${frontConfig.value.coin}&tsyms=USDT,USD&site=${location.hostname}`)
                .then((res: any) => {
                    state.currencyObj = res;
                    // TODO vuex 全局存储
                    // this.mainService.setEosPrice(state.currencyObj);
                    setTimeout(() => {
                        getData();
                    }, timeForUpdate.value);
                })
                .catch(err => {
                    console.error(err);
                    setTimeout(() => {
                        getData();
                    }, timeForUpdate.value);
                });
        };

        const getBlockchainData = () => {
            GET_INFO().then((res: any) => {
                // console.log(res);
                state.blockchainData = res;
            });
        };

        const getAggregationData = () => {
            GET_AGGREGATION_STAT().then((res: any) => {
                state.aggragationData = res;
            });
        };

        const countRamPrice = (res: any) => {
            if (!res || !res.rows || !res.rows[0] || !res.rows[0].quote || !res.rows[0].base) {
                return console.error('data error', res);
            }
            let data = res.rows[0];
            let quoteBalance = Number(data.quote.balance.split(' ')[0]);
            let baseBalance = Number(data.base.balance.split(' ')[0]);
            state.ramPrice = ((quoteBalance / baseBalance) * 1024).toFixed(5);
        };

        const getRam = () => {
            GET_TABLE_ROWS('amax', 'rammarket', 10).then((res: any) => {
                countRamPrice(res);
            });
        };

        const countTPS = (data: any[]): number => {
            let start = data[0].transactions.length;
            let end = data[1].transactions.length;
            return start + end;
        };

        onMounted(() => {
            // console.log(IO);
            // IO.connect();
        });

        const toggleShow = () => {
            // console.log(123)
            emit('update:modelValue', !props.modelValue);
        };

        const onInit = () => {
            getData();
            getChart();
            getBlockchainData();
            getAggregationData();
            getRam();

            // TODO 没调通
            socket.on('get_ram', (res: any) => {
                // console.log('get_ram', res);
                countRamPrice(res);
            });

            socket.on('get_info', (res: any) => {
                // console.log('get_info', res);
                state.blockchainData = res;
            });
            socket.on('users_online', (res: any) => {
                // console.log('users_online', res);
                state.usersOnline = res;
            });

            socket.on('get_tps_blocks', (res: any) => {
                // console.log('get_tps_blocks', res);
                if (res && res.length === 2) {
                    state.TPSLiveTx = countTPS(res);
                    state.producer = state.producer === res[1].producer ? state.producer : res[1].producer;
                    // TODO 切换用户
                    store.dispatch('changeMessage', state.producer);
                }
            });

            socket.on('get_aggregation', (res: any) => {
                // console.log('get_aggregation', res);
                state.aggragationData = res;
            });
        };
        onDeactivated(() => {
            socket.close();
            socket.disconnect();
        });
        onUnmounted(() => {
            socket.close();
            socket.disconnect();
        });

        onInit();

        return {
            frontConfig,
            state,
            toggleShow,
        };
    },
});
</script>
