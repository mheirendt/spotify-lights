<template>
  <div class="track-visualizer" v-if="track">
    <div class="d-flex align-center justify-center">
      <div class="pa-2">{{ time.progress | minutes }}</div>
      <v-progress-linear
        style="max-width: 500px"
        color="secondary"
        :value="time.percent"
      />
      <div class="pa-2">{{ time.duration | minutes }}</div>
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
    time() {
      // Destructure the info we need from the track
      let { duration, timestamp, progress, paused } = this.track;

      // The api is polled every XX seconds, so we need to offset the
      // progress with the timestamp of when the data was requrested
      if (!paused && progress <= duration) {
        progress = this.now - new Date(timestamp - progress);
      }
      const remaining = duration - progress;
      const percent = Math.min(Math.round((progress / duration) * 100), 100);
      return {
        progress,
        remaining,
        percent,
        duration,
      };
    },
  },
};
</script>