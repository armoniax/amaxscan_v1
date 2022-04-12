<template lang="pug">
div
    h3.text-xl.lg_text-3xl.mb-2.px-4.lg_px-0 {{ title }}
    .bg-gray.text-gray-666.overflow-scroll
        slot
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
    },
    setup() {},
});
</script>
