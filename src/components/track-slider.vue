<template>
  <v-slider
    v-bind="$attrs"
    :max="duration"
    :min="0"
    :value="value"
    @start="sliding = true"
    @end="seek($event)"
  >
    <template #prepend>
      <div>{{ progress | minutes }}</div>
    </template>
    <template #append>
      <div>{{ duration | minutes }}</div>
    </template>
  </v-slider>
</template>

<script>
export default {
  $inheritAttrs: false,
  props: {
    duration: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    onSeek: {
      type: Function,
      default: () => Promise.resolve(),
    },
  },
  data: () => ({
    sliding: false,
    value: 0,
  }),
  watch: {
    progress() {
      if (!this.sliding) {
        this.value = this.progress;
      }
    },
  },
  methods: {
    async seek(progress) {
      await this.onSeek(progress);
      this.value = progress;
      this.sliding = false;
    },
  },
};
</script>