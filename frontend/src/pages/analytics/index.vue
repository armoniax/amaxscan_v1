<template lang="pug">
.py-2.space-y-4.analytics.text-sm.font-normal.px-2.lg_px-0
    .analytics_token
        span Token:
        router-link(:class={'active': token === 'amax'})(to='/analytics/amax') AMAX
        router-link(:class={'active': token === 'cnyd'})(to='/analytics/cnyd') CNYD
        router-link(:class={'active': token === 'apl'})(to='/analytics/apl') APL
    
    .flex.flex-col.lg_flex-row
        .flex-1
            .h-8.text-2xl.font-bold.mb-4 Top 50 accounts
            v-chart.w-full.h-96.bg-gray-fb.analytics_chart(:option='option', ref='chart')
        .flex-1.lg_w-80.lg_ml-5.lg_flex-none.ml-0.mt-6.lg_mt-0.mb-4
            .h8.text-lg.font-bold Legend

            .divide-y.divide-gray-f4(v-if='pieChart?.length')
                .flex.p-3.items-center.justify-between.cursor-pointer.hover_bg-gray.transition.duration-300(v-for='(item, index) in pieChart', :key='index')
                    .flex.items-center
                        .w-4.h-4.rounded-sm.bg-green
                        span.ml-2 {{ item.name }}
                    span {{ item.value }}
            .divide-y.divide-gray-f4(v-else)
                .py-4.text-gray-999 None yet

    .overflow-x-auto.scroll-hidden
        table.table.w-full
            thead
                tr
                    th #
                    th Name
                    th AMAX
                    th CNYD
                    th APL
            tbody
                tr(v-for='(element, i) in tableList', :key='i')
                    th {{ i + 1 }}
                    th
                        span.text-green.cursor-pointer(@click='$router.push(`/account/${element?.name}`)') {{ element?.name }}
                    th {{ element?.amax }}
                    th {{ element?.cnyd }}
                    th {{ element?.apl }}

    .flex.justify-end.items-center.text-gray-666.py-3
        span(style="margin-right: 1.5rem;") Current Page: {{ pageIndex }}
        //- select.outline-none.h-6.w-10.border.rounded.mx-2.border-gray-f4.cursor-pointer
        //-     option(v-for='i in 10', :key='i') {{ i }}
        //- span 1 - 40 of 40
        span.outline-none.h-6.w-6.border.rounded.mx-2.border-gray-f4.cursor-pointer.text-gray-666.text-center(@click="pageIndex !== 1 && getTableList(pageIndex-1)") &lt;
        span.outline-none.h-6.w-6.border.rounded.border-gray-f4.cursor-pointer.text-gray-666.text-center(@click="(tableList.length === 20 ) && getTableList(pageIndex+1)") >
</template>

<script lang="ts">
import { compile, computed, defineComponent, onMounted, reactive, ref, watch, toRefs } from 'vue';
import { use } from 'echarts/core';
import { useRoute } from 'vue-router';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { Ax } from '@/apis';
import { environment } from '@/environments/environment';

use([CanvasRenderer, PieChart, GridComponent]);

export default defineComponent({
    components: { VChart },
    setup() {
        const chart = ref();
        const frontConfig = environment.frontConfig;
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
        const route = useRoute();
        const token = computed(() => route.params.token as string);

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
            spinner: true,
            tableList: [],
            pageIndex: 1,
        });


        watch(route, (newVlaue, oldValue) => {
            onInit();
        });

        const getAccounts = () => {
            Ax.get(`http://172.20.142.169:18092/account/getTop/${token.value}/10`)
                .then((res: any) => {
                    pieChart.value = createPieChart(res.data, token.value);
                    dataSource.value = res.data;
                })
        };

        const createPieChart = (data, token) => {
            if (!data) {
                return;
            }
            let result = data.map(elem => {
                let value;
                switch(token){
                    case 'amax': value = Math.floor(elem.amax); break;
                    case 'cnyd': value = Math.floor(elem.cnyd); break;
                    default: value = Math.floor(elem.apl); break;
                }
                return { name: elem.name, value };
            });
            //result.shift();
            return result;
        };

        const getTableList = (pageIndex = 1) => {
            state.pageIndex = pageIndex;
            Ax.get(`http://172.20.142.169:18092/account/listbyceator?token=${token.value}&pageIndex=${pageIndex}&pageSize=20`)
                .then((res: any) => {
                    state.tableList = res.data;
                })
        }

        const onInit = () => {
            getAccounts();
            getTableList();
        };

        onInit();

        return {
            ...toRefs(state),
            token,
            chart,
            option,
            pieChart,
            dataSource,
            state,
            frontConfig,
            getTableList
        };
    },
});
</script>


<style lang="scss" scoped>
.analytics {
    th {
        @apply font-normal text-sm text-gray-666;
    }
    .analytics_token{
        font-size: 1.1rem;
        margin-top: .5rem;
        
        span{
            margin-right: 2rem;
            font-weight: 700;
        }
        a{
            font-weight: 500;
            margin-right: 1rem;
        }
        .active{
            color: rgb(48, 168, 115);
        }
    }
    .analytics_chart{
        height: 27rem;
    }
}
</style>