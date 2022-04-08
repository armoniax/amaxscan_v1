<template lang="pug">
.flex.py-6.ram
    .flex-1
        .flex.justify-between.items-center
            p.font-medium.text-2xl
                | {{ frontConfig?.coin }} RAM Price
                span.text-sm.ml-2.text-gray-666 {{ frontConfig?.coin }}/kb RAM
            ul.flex.text-sm.space-x-4.font-normal
                li.bg-gray.rounded.w-8.h-6.flex.items-center.justify-center.cursor-pointer(:class='state.defaultTimeName === t ? "is-active" : ""', v-for='t in state.timeArray', @click='toggleTime(t)') {{ t }}
        v-chart.w-full.h-96(:option='option')
    .w-80.ml-5
        p.text-lg Legend
        .flex.flex-col.items-end.font-normal.text-sm
            p.text-gray-999.mb-2 {{ frontConfig?.coin }} RAM price:
            p.font-medium.text-lg.mb-6 {{ state.ramPrice }} {{ frontConfig?.coin }}/kb
            p.text-gray-999.mb-2 Overall RAM:
            .flex.items-center.justify-between.w-full.font-medium.mb-2
                span {{ (state.globalStat?.total_ram_bytes_reserved / 1024 / 1024 / 1024).toLocaleString() }} GB / {{ ((state.globalStat?.total_ram_bytes_reserved / state.globalStat?.max_ram_size) * 100).toLocaleString() }} %
                span {{ (state.globalStat?.max_ram_size / 1024 / 1024 / 1024).toLocaleString() }} GB
            .w-full.bg-green.bg-opacity-20.h-3.rounded-full.relative.overflow-hidden.mb-6
                .absolute.top-0.left-0.h-full.bg-green.rounded-full.transition-all.duration-200(:style='{ width: (state.globalStat?.total_ram_bytes_reserved / state.globalStat?.max_ram_size) * 100 + "%" }')
            //- .h-12.w-full.text-white.text-lg.flex.justify-center.items-center.rounded.cursor-pointer(style='background: linear-gradient(139deg, #2ff443 0%, #32d5d8 100%)') Connect Wallet
            //- .h-12.w-full.text-white.text-lg.flex.justify-center.items-center.rounded.cursor-pointer(v-if='!loginEOSService?.accountName', style='background: linear-gradient(139deg, #2ff443 0%, #32d5d8 100%)', @click='loginEOSService.initScatter') Connect Wallet
            //- .h-12.w-full.text-white.text-lg.flex.justify-center.items-center.rounded.cursor-pointer(v-else, style='background: linear-gradient(139deg, #2ff443 0%, #32d5d8 100%)', @click='loginEOSService.logout') Logout
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, inject, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { environment } from '@/environments/environment';
import { Ax } from '@/apis';

import dayjs from 'dayjs';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, DataZoomComponent]);

const frontConfig = environment.frontConfig;
export default defineComponent({
    components: { VChart },
    setup() {
        const account = ref('amax');

        const socket = inject('socket') as any;
        const frontConfig = ref(environment.frontConfig);
        const state = reactive<any>({
            spinnerRAM: false,
            ramPrice: '0.00000',
            dateFrom: new Date(+new Date() - 24 * 60 * 60 * 1000),
            globalStat: null,
            defaultTimeName: '1d',
            timeArray: ['1d', '1w', '1m', 'all'],
        });

        const option = ref({
            color: '#0E9CFF',
            grid: {
                top: 48,
                // left: 48,
                right: 48,
                bottom: 48,
            },
            // title: {
            //     text: frontConfig.value?.coin,
            // },
            dataZoom: [
                {
                    show: true,
                    realtime: true,

                    xAxisIndex: [0, 1],
                },
                {
                    type: 'inside',
                    realtime: true,

                    xAxisIndex: [0, 1],
                },
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
            },
            tooltip: {
                trigger: 'axis',
            },
            yAxis: {
                max: 'dataMax',
                type: 'value',
            },
            series: [
                {
                    areaStyle: {
                        color: 'rgba(14, 156, 255, 0.2)',
                    },
                    data: [],
                    type: 'line',
                },
            ],
        });

        const getGlobal = () => {
            Ax.get(`/v1/get_table_rows/${account.value}/${account.value}/global/10`)
                .then((res: any) => {
                    if (!res || !res.rows) {
                        return console.error('data error', res);
                    }
                    state.globalStat = res.rows[0];
                })
                .catch(err => {
                    console.log(err);
                });
        };

        const toggleTime = (t: string) => {
            if (t === state.defaultTimeName) return;
            state.defaultTimeName = t;
            let date = state.dateFrom;
            if (t === '1d') {
                date = +new Date() - 24 * 3600000;
            } else if (t === '1w') {
                date = +new Date() - 7 * 24 * 3600000;
            } else if (t === '1m') {
                date = +new Date() - 30 * 7 * 24 * 3600000;
            } else if (t === 'all') {
                date = 0;
            }
            getChart(date);
        };

        const getChart = (from: any) => {
            state.spinnerRAM = true;
            Ax.post(`/v1/get_chart_ram`, { from })
                .then((res: any) => {
                    // console.log(createChartArr(res));
                    option.value.series[0].data = createChartArr(res).map(item => item.value) as any;
                    option.value.xAxis.data = createChartArr(res).map(item => dayjs(item.name).format('MM/DD HH:mm')) as any;
                    state.spinnerRAM = false;
                })
                .catch(err => {
                    console.log(err);
                });
        };

        const createChartArr = (data: any[]) => {
            let result: any[] = [];
            data.forEach(elem => {
                let quoteBalance = Number(elem.first.quote.split(' ')[0]);
                let baseBalance = Number(elem.first.base.split(' ')[0]);
                result.push({ name: new Date(elem._id), value: ((quoteBalance / baseBalance) * 1024).toFixed(8) });
            });
            return result;
        };

        const getRam = () => {
            Ax.get(`/v1/get_table_rows/amax/amax/rammarket/10`)
                .then((res: any) => {
                    countRamPrice(res);
                })
                .catch(err => {
                    console.log(err);
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

        getGlobal();
        getRam();
        getChart(state.dateFrom);

        //  if (this.loginEOSService.accountName){
        //  	this.scatterService.getOrderHistory();
        //  } else {
        //  	this.loginEOSService.loggedIn.subscribe(res => {
        //     	this.scatterService.getOrderHistory();
        //  	});
        //  }

        socket.on('get_ram', (res: any) => {
            countRamPrice(res);
        });

        return {
            toggleTime,
            frontConfig,
            option,
            state,
        };
    },
});
</script>

<style lang="scss">
.ram {
    .is-active {
        @apply bg-green text-white;
    }
}
</style>
