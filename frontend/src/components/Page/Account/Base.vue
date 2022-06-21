<template lang="pug">
.flex.justify-between.text-sm.items-stretch
    table.table.border.rounded.border-green.flex-1.lg_mr-12
      tbody
        tr.h-10
          td.border.border-green.align-top.space-y-2
            .w-24.lg_w-44.text-black.font-bold {{ $t('message.account_detail_tb1') }}
            .text-gray-999 {{ balance }} {{ state.frontConfig?.coin }}
          td.border.border-green.align-top.space-y-2
            .w-24.lg_w-44.text-black.font-bold {{ $t('message.account_detail_tb2') }}
            .text-gray-999 {{ unstaked }} {{ state.frontConfig?.coin }}
          td.border.border-green.align-top.space-y-2
            .w-24.lg_w-44.text-black.font-bold {{ $t('message.account_detail_tb3') }}
            .text-gray-999 {{ mainData?.voter_info?.staked ? mainData?.voter_info?.staked / 100000000 : 0 }} {{ state.frontConfig?.coin }}
        tr.h-10
          td.border.border-green.align-top.space-y-2
            .w-24.lg_w-44.text-black.font-bold {{ $t('message.account_detail_tb4') }}
            .font-normal
              .text-gray-999
                | {{ $t('message.account_detail_tb4_1') }}
                span.mx-2 {{ mainData?.total_resources?.cpu_weight }}
              .text-gray-999
                | {{ $t('message.account_detail_tb4_2') }}
                span.mx-2 {{ mainData?.total_resources?.net_weight }}
              .text-gray-999
                | {{ $t('message.account_detail_tb4_3') }}
                span.mx-2 {{ mainData?.total_resources?.owner }}
          td.border.border-green.align-top.space-y-2
            .w-24.lg_w-44.text-black.font-bold {{ $t('message.account_detail_tb5') }}
            .font-normal
              .text-gray-999
                | {{ $t('message.account_detail_tb5_1') }}
                span.mx-2 {{ mainData?.delegated_bandwidth?.cpu_weight }}
              .text-gray-999
                | {{ $t('message.account_detail_tb5_2') }}
                span.mx-2 {{ mainData?.delegated_bandwidth?.from }}
              .text-gray-999
                | {{ $t('message.account_detail_tb5_3') }}
                span.mx-2 {{ mainData?.delegated_bandwidth?.net_weight }}
              .text-gray-999
                | {{ $t('message.account_detail_tb5_4') }}
                span.mx-2 {{ mainData?.delegated_bandwidth?.to }}
          td.border.border-green.align-top.space-y-2
            .w-24.lg_w-44.text-black.font-bold {{ $t('message.account_detail_tb6') }}
            .font-normal
              .text-gray-999
                | {{ $t('message.account_detail_tb6_1') }}
                span.mx-2 {{ mainData?.voter_info?.last_vote_weight }}
              .text-gray-999
                | {{ $t('message.account_detail_tb6_2') }}
                span.mx-2 {{ mainData?.voter_info?.owner }}
    .flex.flex-col.justify-between
      .font-normal
        .w-full CPU
          span.font-normal.text-xs.ml-4.text-gray-666 {{ (mainData?.cpu_limit?.used / 1000000).toFixed(4) }} sec / {{ (mainData?.cpu_limit?.max / 1000000).toFixed(4) }} sec
        .flex-1.flex.items-center.w-full
            .lg_flex-none.w-full.flex-1.lg_w-80.bg-green.bg-opacity-20.relative.h-2.overflow-hidden.rounded-full
                .absolute.h-full.top-0.left-0.transition-all.duration-300.bg-green.rounded-full(:style='{ width: (mainData?.cpu_limit?.used / mainData?.cpu_limit?.max) * 100 + "%" }')
      .font-normal
        .w-full NET
          span.font-normal.text-xs.ml-4.text-gray-666 {{ (mainData?.net_limit?.used / 1024).toFixed(2) }} kb / {{ (mainData?.net_limit?.max / 1024).toFixed(2) }} kb
        .flex-1.flex.items-center.w-full
            .lg_flex-none.w-full.flex-1.lg_w-80.bg-blue.bg-opacity-20.relative.h-2.overflow-hidden.rounded-full
                .absolute.h-full.top-0.left-0.transition-all.duration-300.bg-blue.rounded-full(:style='{ width: (mainData?.net_limit?.used / mainData?.net_limit?.max) * 100 + "%" }')
      .font-normal
        .w-full RAM
          span.font-normal.text-xs.ml-4.text-gray-666 {{ (mainData?.ram_usage / 1024).toFixed(2) }} kb / {{ (mainData?.ram_quota / 1024).toFixed(2) }} kb
        .flex-1.flex.items-center.w-full
            .lg_flex-none.w-full.flex-1.lg_w-80.bg-purple.bg-opacity-20.relative.h-2.overflow-hidden.rounded-full
                .absolute.h-full.top-0.left-0.transition-all.duration-300.bg-purple.rounded-full(:style='{ width: (mainData?.ram_usage / mainData?.ram_quota) * 100 + "%" }')
    //- .flex.items-center
        .w-24.lg_w-44 Total Balance:
        .flex-1 {{ balance }} {{ state.frontConfig?.coin }}
            //- span(v-if="state.frontConfig?.convertToUSD") / {{ (balance * eosRate?.RAW[frontConfig.coin]?.USD?.PRICE).toLocaleString() }} USD
    //- .flex.items-center
        .w-24.lg_w-44 Unstaked
        .flex-1.text-gray-999 {{ unstaked }} {{ state.frontConfig?.coin }}
    //- .flex.items-center
        .w-24.lg_w-44 Staked
        .flex-1.text-gray-999 {{ mainData?.voter_info?.staked ? mainData?.voter_info?.staked / 100000000 : 0 }} {{ state.frontConfig?.coin }}
    //- .flex.lg_items-center.flex-col.lg_flex-row.items-start
        .w-24.lg_w-44 CPU
        .flex-1.flex.items-center.w-full
            .lg_flex-none.w-full.flex-1.lg_w-80.bg-green.bg-opacity-20.relative.h-2.overflow-hidden.rounded-full
                .absolute.h-full.top-0.left-0.transition-all.duration-300.bg-green.rounded-full(:style='{ width: (mainData?.cpu_limit?.used / mainData?.cpu_limit?.max) * 100 + "%" }')
            span.font-normal.text-xs.ml-4.text-gray-666 {{ (mainData?.cpu_limit?.used / 1000000).toFixed(2) }} sec / {{ (mainData?.cpu_limit?.max / 1000000).toFixed(2) }} sec
    //- .flex.lg_items-center.flex-col.lg_flex-row.items-start
        .w-24.lg_w-44 NET
        .flex-1.flex.items-center.w-full
            .lg_flex-none.w-full.flex-1.lg_w-80.bg-blue.bg-opacity-20.relative.h-2.overflow-hidden.rounded-full
                .absolute.h-full.top-0.left-0.transition-all.duration-300.bg-blue.rounded-full(:style='{ width: (mainData?.net_limit?.used / mainData?.net_limit?.max) * 100 + "%" }')
            span.font-normal.text-xs.ml-4.text-gray-666 {{ (mainData?.net_limit?.used / 1024).toFixed(2) }} kb / {{ (mainData?.net_limit?.max / 1024).toFixed(2) }} kb
    //- .flex.lg_items-center.flex-col.lg_flex-row.items-start
        .w-24.lg_w-44 RAM
        .flex-1.flex.items-center.w-full
            .lg_flex-none.w-full.flex-1.lg_w-80.bg-purple.bg-opacity-20.relative.h-2.overflow-hidden.rounded-full
                .absolute.h-full.top-0.left-0.transition-all.duration-300.bg-purple.rounded-full(:style='{ width: (mainData?.ram_usage / mainData?.ram_quota) * 100 + "%" }')
            span.font-normal.text-xs.ml-4.text-gray-666 {{ (mainData?.ram_usage / 1024).toFixed(2) }} kb / {{ (mainData?.ram_quota / 1024).toFixed(2) }} kb
    //- .flex.items-center
        .w-24.lg_w-44 Total Resources:
        .flex-1.font-normal
            | CPU weight:
            span.text-gray-999.mx-2 {{ mainData?.total_resources?.cpu_weight }}
            | NET weight:
            span.text-gray-999.mx-2 {{ mainData?.total_resources?.net_weight }}
            | Owner:
            span.text-gray-999.mx-2 {{ mainData?.total_resources?.owner }}
    //- .flex.items-center
        .w-24.lg_w-44 Delegated Bandwidth:
        .flex-1.font-normal
            | CPU weight:
            span.text-gray-999.mx-2 {{ mainData?.delegated_bandwidth?.cpu_weight }}
            | from:
            span.text-gray-999.mx-2 {{ mainData?.delegated_bandwidth?.from }}
            | NET weight:
            span.text-gray-999.mx-2 {{ mainData?.delegated_bandwidth?.net_weight }}
            | to:
            span.text-gray-999.mx-2 {{ mainData?.delegated_bandwidth?.to }}
    //- .flex.items-center
        .w-24.lg_w-44 Voter Info:
        .flex-1.font-normal
            | Last vote weight:
            span.text-gray-999.mx-2 {{ mainData?.voter_info?.last_vote_weight }}
            | Owner:
            span.text-gray-999.mx-2 {{ mainData?.voter_info?.owner }}
    //- .flex.items-center
        .w-24.lg_w-44 Created by:
        .flex-1.font-normal
            a(:href='"/account/" + mainData?.creator') {{ mainData?.creator }}
    //- .flex.items-center
        .w-24.lg_w-44 Created at:
        .flex-1.font-normal {{ time }}
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { environment } from '@/environments/environment';
const frontConfig = environment.frontConfig;
export default defineComponent({
    props: {
        time: String,
        unstaked: String,
        balance: String,
        mainData: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    setup() {
        const state = {
            frontConfig: frontConfig,
        };

        return {
            state,
        };
    },
});
</script>
