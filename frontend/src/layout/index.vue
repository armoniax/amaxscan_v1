<template lang="pug">
.flex.flex-col.text-sm.font-semibold.h-screen
  LayoutHeader
  .flex-1(class="overflow-auto")
    LayoutLive(v-model.show="show")
    LayoutActions(v-show="show")
    router-view.container
  LayoutFooter
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import LayoutHeader from './components/Header.vue'
import LayoutFooter from './components/Footer.vue'
import LayoutLive from './components/LiveActions.vue'
import LayoutActions from './components/Actions.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    LayoutHeader,
    LayoutFooter,
    LayoutLive,
    LayoutActions
  },
  setup() {
    const route = useRoute()
    const show = ref(route.path === '/')

    watch(()=>route.path, r=>{
      show.value = r === '/'
    })

    return {
      show
    }
  },
})
</script>
