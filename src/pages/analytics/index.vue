<template lang="pug">
.py-2.space-y-4.analytics.text-sm.font-normal
    .flex 
        .flex-1
            .h-8.text-2xl.font-bold.mb-4 Top 50 accounts
            v-chart.w-full.h-96.bg-gray-fb(:option='option', ref='chart')
        .w-80.ml-5.mb-4
            .h8.text-lg.font-bold Legend

            .divide-y.divide-gray-f4
                .flex.p-3.items-center.justify-between.cursor-pointer.hover_bg-gray.transition.duration-300(v-for='(item, index) in Legends', :key='index')
                    .flex.items-center
                        .w-4.h-4.rounded-sm.bg-green
                        span.ml-2 {{ item.name }}
                    span {{ item.value }}

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
                tr(v-for='i in 10', :key='i')
                    th 0{{ i }}
                    th pojekngj
                    th 102,314,564
                    th 72,314,564
                    th.text-center 72,314,564

    .flex.justify-end.items-center.text-gray-666.py-3
        span Items per pag:
        select.outline-none.h-6.w-10.border.rounded.mx-2.border-gray-f4.cursor-pointer
            option(v-for='i in 10', :key='i') {{ i }}
        span 1 - 40 of 40
        span.outline-none.h-6.w-6.border.rounded.mx-2.border-gray-f4.cursor-pointer.text-gray-666.text-center &lt;
        span.outline-none.h-6.w-6.border.rounded.border-gray-f4.cursor-pointer.text-gray-666.text-center >
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
use([CanvasRenderer, PieChart, GridComponent]);

export default defineComponent({
    components: { VChart },
    setup() {
        const chart = ref();
        const Legends = ref([
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' },
        ]);

        const option = ref({
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
                    data: Legends.value,
                },
            ],
        });

        return {
            chart,
            option,
            Legends,
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