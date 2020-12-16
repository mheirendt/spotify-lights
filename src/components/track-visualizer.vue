<template>
  <div class="track-visualizer" v-if="track">
    {{ progress }}
    {{ percent }}
    <v-progress-linear :value="percent" />
  </div>
</template>

<script>
import Getters from "../store/getters";
export default {
  data: () => ({
    subscription: undefined,
    now: new Date(),
  }),
  created() {
    this.subscription = setInterval(
      function () {
        this.now = new Date();
      }.bind(this),
      1000
    );
  },
  beforeDestroy() {
    clearInterval(this.subscription);
  },
  computed: {
    track() {
      return this.$store.getters[Getters.TRACK];
    },
    progress() {
      return this.now - this.track.started;
    },
    percent() {
      return Math.min(
        Math.round((this.progress / this.track.duration) * 100),
        100
      );
    },
  },
};
</script>