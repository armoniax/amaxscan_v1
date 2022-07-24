<template lang="pug">
.flex.flex-col.lg_flex-row.justify-between
    .overflow-scroll.scroll-hidden
      div
        table.table.w-full.lg_mr-12
          tbody
            tr.h-10
              td.border.border-green.align-top.space-y-2
                .text-black.font-bold {{ $t('message.account_detail_tb1') }}
                .text-gray-999 {{ balance }} {{ state.frontConfig?.coin }}
              td.border.border-green.align-top.space-y-2
                .text-black.font-bold {{ $t('message.account_detail_tb2') }}
                .text-gray-999 {{ unstaked }} {{ state.frontConfig?.coin }}
              td.border.border-green.align-top.space-y-2
                .text-black.font-bold {{ $t('message.account_detail_tb3') }}
                .text-gray-999 {{ mainData?.voter_info?.staked ? mainData?.voter_info?.staked / 100000000 : 0 }} {{ state.frontConfig?.coin }}
            tr.h-10
              td.border.border-green.align-top.space-y-2
                .text-black.font-bold {{ $t('message.account_detail_tb4') }}
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
                .text-black.font-bold {{ $t('message.account_detail_tb5') }}
                .font-normal
                  .text-gray-999
                    | {{ $t('message.account_detail_tb5_1') }}
                    span.mx-2 {{ mainData?.self_delegated_bandwidth?.cpu_weight }}
                  .text-gray-999
                    | {{ $t('message.account_detail_tb5_3') }}
                    span.mx-2 {{ mainData?.self_delegated_bandwidth?.net_weight }}
                  .text-gray-999
                    | {{ $t('message.account_detail_tb5_2') }}
                    span.mx-2 {{ mainData?.self_delegated_bandwidth?.from }}
                  .text-gray-999
                    | {{ $t('message.account_detail_tb5_4') }}
                    span.mx-2 {{ mainData?.self_delegated_bandwidth?.to }}
              td.border.border-green.align-top.space-y-2
                .text-black.font-bold {{ $t('message.account_detail_tb6') }}
                .font-normal
                  .text-gray-999
                    | {{ $t('message.account_detail_tb6_2') }}
                    span.mx-2 {{ mainData?.voter_info?.owner }}
                  .text-gray-999
                    | Staked:
                    span.text-gray-999.mx-2 {{ mainData?.voter_info?.staked }}
                  .text-gray-999
                    | {{ $t('message.account_detail_tb6_1') }}
                    span.mx-2 {{ mainData?.voter_info?.last_vote_weight }}
                  
    .flex.flex-col.space-y-6.lg_mt-0.mt-4
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
