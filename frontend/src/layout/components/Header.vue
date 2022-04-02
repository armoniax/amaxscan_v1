<template lang="pug">
.p-4
  Wrapper.flex.items-center
    router-link(to="/")
      img.object-contain(src="@/assets/images/logo.png", style="width: 95px")
    .flex-1.flex.space-x-8.items-center.justify-end.text-sm.font-semibold
      .flex.w-64.h-8.bg-gray-eee.rounded-full.px-2.items-center
        i.fal.fa-search.text-gray-ca.mr-1.cursor-pointer(@click="search()")
        input.bg-transparent.w-full.h-full.outline-none.text-xs(
          placeholder="Search by block,tx,account,address",
          v-model="keyword"
        )
      router-link(to="/analytics") ANALYTICS
      router-link(to="/ram") RAM
      router-link(to="/producers") PRODUCERS
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Wrapper from '@/components/Wrapper.vue';
import { SEARCCH } from '@/apis';
import router from '@/routers';
export default defineComponent({
    components: { Wrapper },
    setup() {
        let keyword = ref('');
        const search = () => {
            SEARCCH(keyword.value).then((res: any) => {
                if (res.block && !isNaN(+keyword.value)) {
                    router.push({ path: '/block', query: { block: res.block.block_num } });
                } else if (res.transaction) {
                    router.push({ path: '/transaction', query: { tx: res.transaction.id } });
                } else if (res.account) {
                    router.push({ path: `/account/${res.account.account_name}` });
                } else if (res.key) {
                    router.push({ path: '/address', query: { address: keyword.value } });
                } else {
                    // router.push({ path: '/notfound' });
                }
                keyword.value = '';
            });
        };

        return {
            keyword,
            search,
        };
    },
});
</script>
