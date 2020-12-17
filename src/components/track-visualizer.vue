<template>
  <div class="track-visualizer" v-if="track"></div>
</template>

<script>
import Getters from "../store/getters";
export default {
  data: () => ({}),
  computed: {
    track() {
      return this.$store.getters[Getters.TRACK];
    },
  },
};
</script>