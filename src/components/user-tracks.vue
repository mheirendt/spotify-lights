<template>
  <v-data-iterator
    class="user-tracks"
    :items="tracks"
    :options.sync="options"
    :server-items-length="count"
  >
    <template #default="{ items }">
      <v-sheet
        v-for="(item, idx) of items"
        :key="item.added"
        dark
        :color="idx % 2 === 0 ? 'accent' : 'secondary'"
        @click="$emit('select', item)"
        class="track d-flex justify-start"
      >
        <v-img
          :src="item.track.album.images[2].url"
          contain
          :max-height="60"
          :max-width="60"
        ></v-img>
        <div class="flex-vertical align-self-center ml-2">
          <div>{{ item.track.name }}</div>
          <div>{{ item.track.artists.map((a) => a.name).join(", ") }}</div>
        </div>
      </v-sheet>
    </template>
  </v-data-iterator>
</template>

<style lang="scss">
.user-tracks {
  .track {
    cursor: pointer;
  }
  .flex-vertical {
    display: flex;
    flex-direction: column;
  }
}
</style>
<script>
export default {
  props: {
    tracks: Array,
    count: Number,
  },
  data: () => ({
    options: {
      itemsPerPage: 20,
      page: 1,
    },
  }),
  watch: {
    options() {
      this.$emit("page", this.options);
    },
  },
};
</script>