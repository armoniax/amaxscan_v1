<template lang="pug">
.flex.flex-col.text-sm.font-semibold.h-screen
  LayoutHeader
  .flex-1(class="overflow-auto")
    LayoutLive
    router-view.container
  LayoutFooter
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LayoutHeader from './components/Header.vue'
import LayoutFooter from './components/Footer.vue'
import LayoutLive from './components/LiveActions.vue'

export default defineComponent({
  components: {
    LayoutHeader,
    LayoutFooter,
    LayoutLive
  },
  setup() {
    
  },
})
</script>
