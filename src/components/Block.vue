<template lang="pug">
div
    h3.text-3xl.mb-2 {{ title }}
    .bg-gray.text-gray-666
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
