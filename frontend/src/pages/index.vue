<template lang="pug">
.py-8
    .flex.space-x-8
        Block(class='w-2/5', title='Blocks') Blocks
        Block(class='w-3/5', title='Latest Actions') Latest Actions
    Producers
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Producers from './producers/index.vue';
import Block from '@/components/Block.vue';

export default defineComponent({
    components: { Producers, Block },
    setup() {},
});
</script>
