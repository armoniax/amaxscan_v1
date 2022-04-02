<template lang="pug">
.py-2.space-y-4.analytics.text-sm.font-normal
    .flex 
        .flex-1
            .h-8.text-2xl.font-bold.mb-4 Top 50 accounts
            v-chart.w-full.h-96.bg-gray-fb(:option='option', ref='chart')
        .w-80.ml-5.mb-4
            .h8.text-lg.font-bold Legend

            .divide-y.divide-gray-f4(v-if='pieChart?.length')
                .flex.p-3.items-center.justify-between.cursor-pointer.hover_bg-gray.transition.duration-300(v-for='(item, index) in pieChart', :key='index')
                    .flex.items-center
                        .w-4.h-4.rounded-sm.bg-green
                        span.ml-2 {{ item.name }}
                    span {{ item.value }}
            .divide-y.divide-gray-f4(v-else)
                .py-4.text-gray-999 暂无数据

    .overflow-x-auto
        table.table.w-full
            thead
                tr
                    th #
                    th Name
                    th Unstaked
                    th Staked
                    th.text-center Total Balance
            tbody
                tr(v-for='(element, i) in dataSource', :key='i')
                    th {{ i + 1 }}
                    th
                        span.text-green.cursor-pointer(@click='$router.push(`/account/${element?.account_name}`)') {{ element?.account_name }}
                    th {{ element?.unstaked?.toLocaleString() }} {{ frontConfig?.coin }}
                    th {{ element?.staked?.toLocaleString() }} {{ frontConfig?.coin }}
                    th.text-center {{ element?.balance_eos?.toLocaleString() }} {{ frontConfig?.coin }}

    .flex.justify-end.items-center.text-gray-666.py-3
        span Items per pag:
        select.outline-none.h-6.w-10.border.rounded.mx-2.border-gray-f4.cursor-pointer
            option(v-for='i in 10', :key='i') {{ i }}
        span 1 - 40 of 40
        span.outline-none.h-6.w-6.border.rounded.mx-2.border-gray-f4.cursor-pointer.text-gray-666.text-center &lt;
        span.outline-none.h-6.w-6.border.rounded.border-gray-f4.cursor-pointer.text-gray-666.text-center >
</template>

<script lang="ts">
import { compile, computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { Ax } from '@/apis';
use([CanvasRenderer, PieChart, GridComponent]);

export default defineComponent({
    components: { VChart },
    setup() {
        const chart = ref();
        // const Legends = ref([
        //     { value: 40, name: 'rose 1' },
        //     { value: 38, name: 'rose 2' },
        //     { value: 32, name: 'rose 3' },
        //     { value: 30, name: 'rose 4' },
        //     { value: 28, name: 'rose 5' },
        //     { value: 26, name: 'rose 6' },
        //     { value: 22, name: 'rose 7' },
        //     { value: 18, name: 'rose 8' },
        // ]);
        const dataSource = ref([]);
        const mainData = ref([]);
        const pieChart = ref();

        const option = computed(() => {
            return {
                series: [
                    {
                        height: 400,
                        name: 'Top 50 accounts',
                        type: 'pie',
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8,
                        },
                        data: pieChart.value,
                    },
                ],
            };
        });
        const state = reactive({
            spinner: false,
        });

        const getAccounts = () => {
            state.spinner = true;
            Ax.get(`/api/v1/get_accounts_analytics/50`)
                .then((res: any) => {
                    // mainData.value = res;

                    pieChart.value = createPieChart(res);
                    // let ELEMENT_DATA: Element[] = this.mainData;

                    dataSource.value = res;

                    state.spinner = false;
                })
                .catch(error => {
                    console.error(error);
                    state.spinner = false;
                });
        };

        const createPieChart = data => {
            if (!data) {
                return;
            }
            let result = data.map(elem => {
                return { name: elem.account_name, value: Math.floor(elem.unstaked) };
            });
            //result.shift();
            return result;
        };

        const getChart = () => {
            Ax.post(`/api/v1/get_trx_actions`, { date: +new Date() - 7 * 24 * 60 * 60 * 1000 })
                .then((res: any) => {
                    createChart(res);
                })
                .catch(err => {
                    console.error(err);
                });
        };

        const createChart = data => {
            if (!data) {
                return console.log('========= data error chart', data);
            }
            const trx = [];
            const actions = [];
            data.forEach(elem => {
                trx.push({ name: new Date(`${elem._id.year}/${elem._id.month}/${elem._id.dayOfMonth}`), value: elem.transactions[elem.transactions.length - 1] - elem.transactions[0] });
                actions.push({ name: new Date(`${elem._id.year}/${elem._id.month}/${elem._id.dayOfMonth}`), value: elem.actions[elem.actions.length - 1] - elem.actions[0] });
            });
            console.log(trx, actions);
        };

        const getGlobal = () => {
            Ax.get(`/api/v1/get_table_rows/amax/amax/global/10`)
                .then((res: any) => {
                    if (!res || !res.rows) {
                        return console.error('data error', res);
                    }
                    const globalStat = res.rows[0];
                })
                .catch(err => {
                    console.error(err);
                });
        };

        const onInit = () => {
            getAccounts();
            getGlobal();
            getChart();
        };

        onInit();

        return {
            chart,
            option,
            pieChart,
            // Legends,
            dataSource,
            state,
        };
    },
});
</script>


<style lang="scss">
.analytics {
    th {
        @apply font-normal text-sm text-gray-666;
    }
}
</style>