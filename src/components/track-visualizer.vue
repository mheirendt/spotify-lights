<template>
  <div class="track-visualizer" v-if="track">
    <div class="d-flex align-center justify-center">
      <div class="pa-2">{{ time.elapsed | minutes }}</div>
      <v-progress-linear
        style="max-width: 500px"
        color="secondary"
        :value="time.percent"
      />
      <div class="pa-2">{{ time.length | minutes }}</div>
    </div>
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
      250
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
      return this.track.paused || this.track.progress === this.track.duration
        ? this.track.progress
        : this.now - new Date(this.track.timestamp - this.track.progress);
    },
    time() {
      const elapsed =
        this.progress > this.track.duration ? this.lengthMin : this.progress;
      const remaining =
        this.progress > this.track.duration
          ? 0
          : this.track.duration - this.progress;
      const length = this.track.duration;
      const percent = Math.min(
        Math.round((this.progress / this.track.duration) * 100),
        100
      );
      return {
        elapsed,
        remaining,
        length,
        percent,
      };
    },
  },
};
</script>