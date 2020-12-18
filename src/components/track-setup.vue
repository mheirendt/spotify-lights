<template>
  <div class="track-setup" v-if="track">
    <div class="d-flex justify-center pt-2">
      <track-slider
        v-if="track.duration"
        style="max-width: 800px"
        :duration="track.duration"
        :progress="progress"
        :on-seek="seek"
      />
    </div>
  </div>
</template>

<script>
import Getters from "../store/getters";
import trackSlider from "./track-slider.vue";
export default {
  components: { trackSlider },
  data: () => ({
    progress: 0,
  }),
  computed: {
    track() {
      return this.$store.getters[Getters.TRACK];
    },
  },
  methods: {
    seek(progress) {
      this.progress = progress;
      return Promise.resolve();
    },
  },
};
</script>