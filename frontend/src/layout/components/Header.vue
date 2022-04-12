<template lang="pug">
.lg_p-4.p-2
    Wrapper.flex.items-center
        router-link.mr-2(to='/')
            img.object-contain.lg_w-24.w-16(src='@/assets/images/logo.png', style='image-rendering: -webkit-optimize-contrast')
        .flex-1.flex.space-x-8.items-center.justify-end.text-sm.font-semibold
            .w-full.flex.lg_w-80.h-8.bg-gray-eee.rounded-full.px-2.items-center
                input.pl-4.bg-transparent.w-full.h-full.outline-none.text-xs(placeholder='Search by Address / Txn Hash / Account / Block', v-model='keyword', @keyup='changeInput')
                i.text-xl.fal.fa-search.text-gray-ca.mr-1.cursor-pointer(@click='search()')
                //- span.btn.btn-xs.rounded-full(:class='keyword ? "cursor-pointer" : "opacity-50 cursor-not-allowed"', @click='search') Search
            .space-x-4.hidden.lg_block
                router-link(to='/analytics') ANALYTICS
                router-link(to='/ram') RAM
                router-link(to='/producers') PRODUCERS
    .lg_hidden.flex.pt-4.space-x-4.flex-nowrap.overflow-x-scroll
        router-link(to='/analytics') ANALYTICS
        router-link(to='/ram') RAM
        router-link(to='/producers') PRODUCERS

    //- .alert.alert-error.shadow-l
    //-     div
    //-         svg.stroke-current.flex-shrink-0.h-6.w-6(xmlns='http://www.w3.org/2000/svg', fill='none', viewBox='0 0 24 24')
    //-             path(stroke-linecap='round', stroke-linejoin='round', stroke-width='2', d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z') 
    //-         span Error! Task failed successfully.
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
                // console.log(res);
                if (res.block && !isNaN(+keyword.value)) {
                    router.push({ path: `/block/${res.block.block_num}` });
                } else if (res.transaction) {
                    router.push({ path: '/transaction', query: { tx: res.transaction.id } });
                } else if (res.account) {
                    router.push({ path: `/account/${res.account.account_name}` });
                } else if (res.key) {
                    router.push({ path: '/address', query: { address: keyword.value } });
                } else {
                    router.push({ path: '/notfound' });
                }
                keyword.value = '';
            });
        };

        const changeInput = event => {
            if (event.keyCode == 13) {
                search();
            }
        };

        return {
            keyword,
            search,
            changeInput,
        };
    },
});
</script>
