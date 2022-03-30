<template lang="pug">
RawDataBase(title="Contract Raw Data:" :json="json")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RawDataBase from "./Base.vue";

export default defineComponent({
  components: { RawDataBase },
  props: {
    json: {
      type: [Object, String],
      default: function(){
        return {}
      },
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup() {},
});
</script>
